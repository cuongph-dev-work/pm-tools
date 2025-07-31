import { GIT_ALERT_PRIORITY, GIT_ALERT_TAG, GIT_ALERT_TYPE } from '@configs/enum/db';
import { GitRepository } from '@entities/git-repository.entity';
import { GitAlertService } from '@modules/git-alert/git-alert.service';
import { WebhookGitHubHeaders } from '@modules/webhook/webhook.controller';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Webhooks } from '@octokit/webhooks';
import { WinstonLogger } from '@shared/modules/logger/logger.service';
import { WrapperType } from 'src/types/request.type';
import { GitRepoRepository } from './git.repository';

export interface GitHubWebhookData {
  body: any;
  headers: WebhookGitHubHeaders;
  rawBody: Buffer;
}

export interface GitLabWebhookData {
  body: any;
  headers: WebhookGitLabHeaders;
  rawBody: Buffer;
}

export interface WebhookGitHubHeaders {
  'x-hub-signature': string;
  'x-github-event': string;
  'x-hub-signature-256': string;
  'x-github-delivery': string;
  'content-type': string;
}

export interface WebhookGitLabHeaders {
  'x-gitlab-event': string;
  'x-gitlab-token': string;
  'x-gitlab-event-uuid': string;
  'content-type': string;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  constructor(
    @Inject(forwardRef(() => GitRepoRepository))
    private readonly gitRepoRepository: WrapperType<GitRepoRepository>,
    private readonly gitAlertService: GitAlertService,
  ) {}

  async findRepositoryByUrl(url: string): Promise<GitRepository | null> {
    return this.gitRepoRepository.findOne({ url }, { populate: ['project'] });
  }

  async webhookGithub(data: GitHubWebhookData, _logger: WinstonLogger) {
    // _logger.info('Webhook received', { data });
    const { body, headers, rawBody } = data;
    const contentType = headers['content-type'];
    const payload = contentType === 'application/json' ? body : JSON.parse(body.payload);

    const repository = await this.findRepositoryByUrl(payload.repository.html_url);
    if (!repository || !repository.enable_sync) {
      this.logger.log('Repository is not enabled for sync', repository);
      return;
    }

    const secret = repository.webhook_secret;

    const webhooks = new Webhooks({ secret: secret || '' });

    // Merge pull request
    webhooks.on('pull_request.closed', async event => {
      const { number: pull_number, base, title, head, user, created_at, merged_at, merged } = event.payload.pull_request;
      const { owner, name, html_url, private: isPrivate } = event.payload.repository;
      const target_branch = base.ref;
      if (merged) {
        await this.gitAlertService.createGitAlert(
          {
            title: 'Pull Request Merged',
            description: `PR #${pull_number} "${title}" has been successfully merged to ${target_branch} branch`,
            type: GIT_ALERT_TYPE.MERGED,
            tags: [],
            priority: GIT_ALERT_PRIORITY.LOW,
            metadata: {
              repository_name: name,
              repository_url: html_url,
              repository_visibility: isPrivate ? 'PRIVATE' : 'PUBLIC',
              repository_owner: owner.login,
              branch: base.ref,
              commit_hash: head.sha,
              pull_request_number: pull_number,
              author: user.login,
              created_at: created_at,
              merged_at: merged_at,
              title: title,
            },
          },
          repository,
        );
      }
    });

    // Merge conflict
    webhooks.on('pull_request.synchronize', async event => {
      const { number: pull_number, base, head } = event.payload.pull_request;
      const { owner, name: repo, html_url } = event.payload.repository;
      const target_branch = base.ref;
      const source_branch = head.ref;

      const octokit = new Octokit({
        auth: repository.personal_access_token,
      });

      const result = await octokit.pulls.get({
        owner: owner.login,
        repo,
        pull_number,
      });

      const mergeable = result.data.mergeable;
      if (!mergeable) {
        await this.gitAlertService.createGitAlert(
          {
            title: 'Merge Conflict Detected',
            description: `Merge conflict detected when trying to merge ${source_branch} into ${target_branch}`,
            type: GIT_ALERT_TYPE.CONFLICT,
            tags: [],
            priority: GIT_ALERT_PRIORITY.HIGH,
            metadata: {
              repository_name: repo,
              repository_url: html_url,
              created_at: new Date(),
            },
          },
          repository,
        );
      }
    });

    // Pull request review submitted
    webhooks.on('pull_request_review.submitted', async event => {
      const { user: review_user, body, submitted_at: review_created_at } = event.payload.review;
      const { number: pull_number, title, user: pull_request_owner } = event.payload.pull_request;
      const { name, html_url } = event.payload.repository;
      await this.gitAlertService.createGitAlert(
        {
          title: 'New PR Review',
          description: `${review_user?.login} reviewed on PR #${pull_number}`,
          type: GIT_ALERT_TYPE.COMMENT,
          tags: [],
          priority: GIT_ALERT_PRIORITY.LOW,
          metadata: {
            repository_name: name,
            repository_url: html_url,
            pull_request_number: pull_number,
            pull_request_title: title,
            pull_request_owner: pull_request_owner?.login,
            comment_user: review_user?.login,
            comment_body: body,
            comment_created_at: review_created_at,
            comment_url: event.payload.review.html_url,
          },
        },
        repository,
      );
    });

    // Pull request review comment created
    webhooks.on('pull_request_review_comment.created', async event => {
      const { user: comment_user, body, created_at: comment_created_at } = event.payload.comment;
      const { number: pull_number, title, user: pull_request_owner } = event.payload.pull_request;
      const { name, html_url } = event.payload.repository;

      await this.gitAlertService.createGitAlert(
        {
          title: 'New PR Review Comment',
          description: `${comment_user?.login} commented on PR #${pull_number}`,
          type: GIT_ALERT_TYPE.COMMENT,
          tags: [],
          priority: GIT_ALERT_PRIORITY.LOW,
          metadata: {
            repository_name: name,
            repository_url: html_url,
            pull_request_number: pull_number,
            pull_request_title: title,
            pull_request_owner: pull_request_owner?.login,
            comment_user: comment_user?.login,
            comment_body: body,
            comment_created_at: comment_created_at,
            comment_url: event.payload.comment.html_url,
          },
        },
        repository,
      );
    });

    // Comment on pull request
    webhooks.on('issue_comment.created', async event => {
      const isPullRequest = event.payload.issue?.pull_request;

      if (!isPullRequest) return;
      const { number: pull_number, title, user: pull_request_owner } = event.payload.issue;
      const { name, html_url } = event.payload.repository;
      const { user: comment_user, body, created_at: comment_created_at } = event.payload.comment;

      await this.gitAlertService.createGitAlert(
        {
          title: 'New PR Comment',
          description: `${comment_user?.login} commented on PR #${pull_number}`,
          type: GIT_ALERT_TYPE.COMMENT,
          tags: [],
          priority: GIT_ALERT_PRIORITY.LOW,
          metadata: {
            repository_name: name,
            repository_url: html_url,
            pull_request_number: pull_number,
            pull_request_title: title,
            pull_request_owner: pull_request_owner.login,
            comment_user: comment_user?.login,
            comment_body: body,
            comment_created_at: comment_created_at,
            comment_url: event.payload.comment.html_url,
          },
        },
        repository,
      );
    });

    // Check run completed
    // webhooks.on('check_run.completed', async event => {
    //   const {
    //     conclusion,
    //     name,
    //     check_suite: { head_branch },
    //     completed_at,
    //   } = event.payload.check_run;
    //   const { name: repo_name, html_url: repo_url } = event.payload.repository;

    //   const isBuild = name.includes('build');
    //   const isTest = name.includes('test');
    //   const isDeployment = name.includes('deploy');
    //   let title = 'New Check Run';
    //   let prefixDescription = '';

    //   let tags: GIT_ALERT_TAG[] = [];

    //   if (isTest) {
    //     title += ' (Test) ';
    //     prefixDescription = 'Test' + ' ';
    //   } else if (isBuild) {
    //     title += ' (Build) ';
    //     prefixDescription = 'Build' + ' ';
    //   } else if (isDeployment) {
    //     title += ' (Deployment) ';
    //     prefixDescription = 'Deployment' + ' ';
    //   }

    //   if (conclusion === 'success') {
    //     tags = [GIT_ALERT_TAG.CHECK_RUN_SUCCESS];
    //     prefixDescription += 'Success';
    //   }

    //   if (conclusion === 'failure') {
    //     tags = [GIT_ALERT_TAG.CHECK_RUN_FAILED];
    //     prefixDescription += 'Failed';
    //   }

    //   if (conclusion === 'waiting' || conclusion === 'pending') {
    //     tags = [GIT_ALERT_TAG.CHECK_RUN_IN_PROGRESS];
    //     prefixDescription += 'In Progress';
    //   }
    //   const description = `${prefixDescription} on branch ${head_branch}. Check the logs for details.`;
    //   await this.gitAlertService.createGitAlert(
    //     {
    //       title,
    //       description,
    //       type: GIT_ALERT_TYPE.CHECK_RUN,
    //       priority: GIT_ALERT_PRIORITY.LOW,
    //       metadata: {
    //         repository_name: repo_name,
    //         repository_url: repo_url,
    //         branch: head_branch,
    //         check_run_name: name,
    //         check_run_conclusion: conclusion,
    //         check_run_completed_at: completed_at,
    //       },
    //       tags,
    //     },
    //     repository,
    //   );
    // });

    webhooks.on('workflow_run', async event => {
      const { html_url: workflow_run_url, head_branch, name: workflow_run_name, status: workflow_run_status, conclusion: workflow_run_conclusion } = event.payload.workflow_run;
      const { name: repo_name, html_url: repo_url } = event.payload.repository;

      let tags: GIT_ALERT_TAG[] = [];
      let title = `Workflow Run (${workflow_run_name})`;
      let description = `Workflow ${workflow_run_name}`;
      if (workflow_run_status === 'in_progress') {
        title += ' - In Progress';
        tags = [GIT_ALERT_TAG.CHECK_RUN_IN_PROGRESS];
        description += ` is running on branch ${head_branch}`;
      }
      if (workflow_run_status === 'completed' && workflow_run_conclusion === 'success') {
        title += ' - Success';
        tags = [GIT_ALERT_TAG.CHECK_RUN_SUCCESS];
        description += ` completed successfully on branch ${head_branch}`;
      }
      if (workflow_run_status === 'completed' && workflow_run_conclusion === 'failure') {
        title += ' - Failed';
        tags = [GIT_ALERT_TAG.CHECK_RUN_FAILED];
        description += ` failed on branch ${head_branch}`;
      }

      await this.gitAlertService.createGitAlert(
        {
          title,
          description,
          type: GIT_ALERT_TYPE.WORKFLOW_RUN,
          priority: GIT_ALERT_PRIORITY.LOW,
          metadata: {
            repository_name: repo_name,
            repository_url: repo_url,
            workflow_name: workflow_run_name,
            workflow_run_url: workflow_run_url,
          },
          tags,
        },
        repository,
      );
    });

    await webhooks
      .verifyAndReceive({
        id: headers['x-github-delivery'],
        name: headers['x-github-event'],
        payload: rawBody.toString(),
        signature: headers['x-hub-signature-256'],
      })
      .catch(error => {
        this.logger.error('Webhook verification failed', error);
      });
  }

  async webhookGitlab(data: GitLabWebhookData, _logger: WinstonLogger) {
    _logger.info('Webhook received', { data });
    this.logger.log('Webhook received', { data });
    const { body, headers } = data;

    // const repository = await this.findRepositoryByUrl(payload.repository.html_url);
    // if (!repository || !repository.enable_sync) {
    //   this.logger.log('Repository is not enabled for sync', repository);
    //   return;
    // }

    // const secret = repository.webhook_secret;
  }
}
