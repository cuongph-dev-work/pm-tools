import { GIT_ALERT_PRIORITY, GIT_ALERT_TAG, GIT_ALERT_TYPE } from '@configs/enum/db';
import { GitRepository } from '@entities/git-repository.entity';
import { GitAlertService } from '@modules/git-alert/git-alert.service';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Webhooks } from '@octokit/webhooks';
import { WebhookLoggerService } from '@shared/modules/logger/webhook-logger.service';
import { WebhooksGitLab } from '@utils/lib/gitlab-webhook';
import { GitLabWebhookData } from '@utils/lib/gitlab-webhook/type';
import { WrapperType } from 'src/types/request.type';
import { GitRepoRepository } from './git.repository';

export interface GitHubWebhookData {
  body: any;
  headers: WebhookGitHubHeaders;
  rawBody: Buffer;
}

export interface WebhookGitHubHeaders {
  'x-hub-signature': string;
  'x-github-event': string;
  'x-hub-signature-256': string;
  'x-github-delivery': string;
  'content-type': string;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  constructor(
    @Inject(forwardRef(() => GitRepoRepository))
    private readonly gitRepoRepository: WrapperType<GitRepoRepository>,
    private readonly gitAlertService: GitAlertService,
    private readonly webhookLogger: WebhookLoggerService,
  ) {}

  async findRepositoryByUrl(url: string): Promise<GitRepository | null> {
    return this.gitRepoRepository.findOne({ url }, { populate: ['project'] });
  }

  async webhookGithub(data: GitHubWebhookData) {
    // this.loggerService.initInstance('github', 'webhooks');
    // loggerService.info('Webhook received', { data });
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
      const { number: pull_number, base, title, head, user, created_at, merged_at, merged, html_url: pull_request_url } = event.payload.pull_request;
      const { owner, name, html_url: repository_url, private: isPrivate } = event.payload.repository;
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
              repository_url: repository_url,
              repository_visibility: isPrivate ? 'PRIVATE' : 'PUBLIC',
              repository_owner: owner.login,
              branch: base.ref,
              commit_hash: head.sha,
              pull_request_url: pull_request_url,
              pull_request_number: pull_number,
              author: user.login,
              created_at: created_at,
              merged_at: merged_at,
            },
          },
          repository,
        );
      }
    });

    // Merge conflict
    webhooks.on('pull_request.synchronize', async event => {
      const { number: pull_number, base, head, created_at, html_url: pull_request_url } = event.payload.pull_request;
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
              created_at: created_at,
              pull_request_url: pull_request_url,
            },
          },
          repository,
        );
      }
    });

    // Pull request review submitted
    webhooks.on('pull_request_review.submitted', async event => {
      const { user: review_user, body, submitted_at: review_created_at } = event.payload.review;
      const { number: pull_number, title: pull_request_title, user: pull_request_owner } = event.payload.pull_request;
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
            pull_request_title: pull_request_title,
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
      const { number: pull_number, title: pull_request_title, user: pull_request_owner } = event.payload.pull_request;
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
            pull_request_title: pull_request_title,
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
      const { number: pull_number, title: issue_title, user: pull_request_owner } = event.payload.issue;
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
            pull_request_title: issue_title,
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
    //     tags = [GIT_ALERT_TAG.PIPELINE_SUCCESS];
    //     prefixDescription += 'Success';
    //   }

    //   if (conclusion === 'failure') {
    //     tags = [GIT_ALERT_TAG.PIPELINE_FAILED];
    //     prefixDescription += 'Failed';
    //   }

    //   if (conclusion === 'waiting' || conclusion === 'pending') {
    //     tags = [GIT_ALERT_TAG.PIPELINE_IN_PROGRESS];
    //     prefixDescription += 'In Progress';
    //   }
    //   const description = `${prefixDescription} on branch ${head_branch}. Check the logs for details.`;
    //   await this.gitAlertService.createGitAlert(
    //     {
    //       title,
    //       description,
    //       type: GIT_ALERT_TYPE.PIPELINE,
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
      const {
        html_url: workflow_run_url,
        head_branch,
        name: workflow_run_name,
        status: workflow_run_status,
        conclusion: workflow_run_conclusion,
        created_at: workflow_run_created_at,
        updated_at: workflow_run_updated_at,
      } = event.payload.workflow_run;
      const { name: repo_name, html_url: repo_url } = event.payload.repository;

      let tags: GIT_ALERT_TAG[] = [];
      let title = `PIPELINE (${workflow_run_name})`;
      let priority = GIT_ALERT_PRIORITY.LOW;
      let description = `Pipeline ${workflow_run_name}`;
      if (workflow_run_status === 'in_progress') {
        title += ' - In Progress';
        tags = [GIT_ALERT_TAG.PIPELINE_IN_PROGRESS];
        description += ` is running on branch ${head_branch}`;
      }
      if (workflow_run_status === 'completed' && workflow_run_conclusion === 'success') {
        title += ' - Success';
        tags = [GIT_ALERT_TAG.PIPELINE_SUCCESS];
        description += ` completed successfully on branch ${head_branch}`;
      }
      if (workflow_run_status === 'completed' && workflow_run_conclusion === 'failure') {
        title += ' - Failed';
        tags = [GIT_ALERT_TAG.PIPELINE_FAILED];
        description += ` failed on branch ${head_branch}`;
        priority = GIT_ALERT_PRIORITY.HIGH;
      }

      await this.gitAlertService.createGitAlert(
        {
          title,
          description,
          type: GIT_ALERT_TYPE.PIPELINE,
          priority,
          metadata: {
            repository_name: repo_name,
            repository_url: repo_url,
            workflow_name: workflow_run_name,
            workflow_run_url: workflow_run_url,
            workflow_run_created_at: workflow_run_created_at,
            workflow_run_finished_at: workflow_run_status === 'completed' && workflow_run_conclusion === 'success' ? workflow_run_updated_at : null,
            workflow_run_failed_at: workflow_run_status === 'completed' && workflow_run_conclusion === 'failure' ? workflow_run_updated_at : null,
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

  // ref: https://devops.runsystem.info/help/user/project/integrations/webhook_events.md
  async webhookGitlab(data: GitLabWebhookData) {
    this.webhookLogger.info('Webhook GitLab received', data);
    const { body } = data;

    const repository = await this.findRepositoryByUrl(body.project.web_url);
    if (!repository || !repository.enable_sync) {
      this.logger.log('Repository is not enabled for sync', repository);
      return;
    }

    const secret = repository.webhook_secret;

    const webhooks = new WebhooksGitLab({ secret: secret || '' });

    webhooks.on('merge_request', async event => {
      const {
        target_branch,
        title: pull_request_title,
        source_branch,
        created_at,
        iid: pull_number,
        url: html_url,
        last_commit,
        action,
        detailed_merge_status,
        merge_status,
      } = event.object_attributes;
      const { name, web_url: repository_url, visibility_level } = event.project;
      const { user } = event;
      const isPrivate = visibility_level === 0;
      const isMerged = action === 'merge';
      const isOpen = action === 'open';
      const isConflict = detailed_merge_status === 'conflict' || merge_status === 'cannot_be_merged';
      let title = '';
      let description = '';

      if (isConflict) {
        await this.gitAlertService.createGitAlert(
          {
            title: 'Merge Conflict Detected',
            description: `Merge conflict detected when trying to merge ${source_branch} into ${target_branch}`,
            type: GIT_ALERT_TYPE.CONFLICT,
            tags: [],
            priority: GIT_ALERT_PRIORITY.HIGH,
            metadata: {
              repository_name: name,
              repository_url: repository_url,
              created_at: this.convertGitLabTime(created_at),
              pull_request_url: html_url,
            },
          },
          repository,
        );
      } else {
        if (isMerged) {
          title = 'Pull Request Merged';
          description = `PR #${pull_number} "${pull_request_title}" has been successfully merged to ${target_branch} branch`;
        } else if (isOpen) {
          title = 'New Pull Request';
          description = `PR #${pull_number} "${pull_request_title}" has been created on ${source_branch} branch`;
        }
        await this.gitAlertService.createGitAlert(
          {
            title,
            description,
            type: GIT_ALERT_TYPE.MERGED,
            tags: [],
            priority: GIT_ALERT_PRIORITY.LOW,
            metadata: {
              repository_name: name,
              repository_url: repository_url,
              repository_visibility: isPrivate ? 'PRIVATE' : 'PUBLIC',
              repository_owner: null,
              branch: source_branch,
              commit_hash: last_commit.id,
              pull_request_number: pull_number,
              pull_request_url: html_url,
              author: user.username,
              created_at: this.convertGitLabTime(created_at),
              merged_at: this.convertGitLabTime(created_at),
            },
          },
          repository,
        );
      }
    });

    webhooks.on('note', async event => {
      const { note, type, created_at, url: comment_url, position, line_code } = event.object_attributes;
      const { iid: pull_number, title: pull_request_title } = event.merge_request || {};
      const { name, web_url: repository_url } = event.project;
      const { user } = event;
      const isReview = type !== 'DiffNote' && !position && !line_code;
      let title = 'New PR Comment';
      let description = `${user?.username} commented on PR #${pull_number}`;
      if (isReview) {
        title = 'New PR Review';
        description = `${user.username} reviewed on PR #${pull_number}`;
      }

      await this.gitAlertService.createGitAlert(
        {
          title,
          description,
          type: GIT_ALERT_TYPE.COMMENT,
          tags: [],
          priority: GIT_ALERT_PRIORITY.LOW,
          metadata: {
            repository_name: name,
            repository_url: repository_url,
            pull_request_number: pull_number,
            pull_request_title: pull_request_title,
            pull_request_owner: null,
            comment_user: user?.username,
            comment_body: note,
            comment_created_at: this.convertGitLabTime(created_at),
            comment_url: comment_url,
          },
        },
        repository,
      );
    });

    webhooks.on('pipeline', async event => {
      const { object_attributes, project } = event;
      const { name: repo_name, web_url: repository_url } = project;
      const { status: workflow_run_status, id: pipeline_id, url: html_url, created_at, finished_at, ref: branch } = object_attributes;

      let tags: GIT_ALERT_TAG[] = [];
      let title = `PIPELINE (#${pipeline_id})`;
      let priority = GIT_ALERT_PRIORITY.LOW;
      let description = `Pipeline #${pipeline_id}`;

      if (workflow_run_status === 'running') {
        title += ' - In Progress';
        tags = [GIT_ALERT_TAG.PIPELINE_IN_PROGRESS];
        description += ` is running on branch ${branch}`;
      }
      if (workflow_run_status === 'success' && finished_at) {
        title += ' - Success';
        tags = [GIT_ALERT_TAG.PIPELINE_SUCCESS];
        description += ` completed successfully on branch ${branch}`;
      }
      if (workflow_run_status === 'failed' && finished_at) {
        title += ' - Failed';
        tags = [GIT_ALERT_TAG.PIPELINE_FAILED];
        description += ` failed on branch ${branch}`;
        priority = GIT_ALERT_PRIORITY.HIGH;
      }

      await this.gitAlertService.createGitAlert(
        {
          title,
          description,
          type: GIT_ALERT_TYPE.PIPELINE,
          priority,
          metadata: {
            repository_name: repo_name,
            repository_url: repository_url,
            workflow_name: `#${pipeline_id}`,
            workflow_run_url: html_url,
            workflow_run_created_at: this.convertGitLabTime(created_at),
            workflow_run_finished_at: this.convertGitLabTime(finished_at),
            workflow_run_failed_at: workflow_run_status === 'failed' ? this.convertGitLabTime(finished_at) : null,
          },
          tags,
        },
        repository,
      );
    });

    await webhooks.verifyAndReceive(data);
  }
  // input: 2025-07-31 14:43:53 UTC
  // output: 2025-07-31T14:43:53.000Z
  private convertGitLabTime(datetime: string | null) {
    if (!datetime) return null;

    const [date, time] = datetime.split(' ');
    const [day, month, year] = date.split('-');
    const [hour, minute, second] = time.split(':');
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`);
  }
}
