import { GIT_ALERT_PRIORITY, GIT_ALERT_TYPE } from '@configs/enum/db';
import { GitAlertService } from '@modules/git-alert/git-alert.service';
import { WebhookHeaders } from '@modules/webhook/webhook.controller';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Webhooks } from '@octokit/webhooks';
import { WinstonLogger } from '@shared/modules/logger/logger.service';
import { WrapperType } from 'src/types/request.type';
import { GitRepoRepository } from './git.repository';

interface WebhookData {
  body: any;
  headers: WebhookHeaders;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  constructor(
    @Inject(forwardRef(() => GitRepoRepository))
    private readonly gitRepoRepository: WrapperType<GitRepoRepository>,
    private readonly gitAlertService: GitAlertService,
  ) {}

  async findRepositoryByUrl(url: string) {
    const repository = await this.gitRepoRepository.findOne({ url }, { populate: ['project'] });
    if (!repository) {
      throw new NotFoundException('Repository not found');
    }
    return repository;
  }

  async webhook(data: WebhookData, _logger: WinstonLogger) {
    _logger.info('Webhook received', { data });
    this.logger.log('Webhook received', { data });

    const repository = await this.findRepositoryByUrl(data.body.repository.html_url);

    const webhooks = new Webhooks({
      secret: 'dVQY6wIjpM2QB1Z' || repository.webhook_secret,
    });

    const verify = await webhooks.verify(data.body, data.headers['X-Hub-Signature-256']);
    if (!verify) {
      throw new UnauthorizedException('Invalid Webhook Signature');
    }

    webhooks.on('pull_request.closed', async event => {
      this.logger.log('Pull Request Closed', { event });

      const {
        number: pull_number,
        base,
        title,
        head,
        user,
        created_at,
        merged_at,
        merged,
      } = event.payload.pull_request;
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

    webhooks.on('pull_request.synchronize', async event => {
      this.logger.log('Pull Request Synchronized', { event });
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
  }
}
