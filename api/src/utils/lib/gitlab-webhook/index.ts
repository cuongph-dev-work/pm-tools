import { Injectable } from '@nestjs/common';
import EventEmitter from 'events';
import {
  GitLabEventName,
  GitLabWebhookData,
  GitlabDeploymentEvent,
  GitlabIssueEvent,
  GitlabJobEvent,
  GitlabMergeRequestEvent,
  GitlabNoteEvent,
  GitlabPipelineEvent,
  GitlabPushEvent,
  GitlabReleaseEvent,
  GitlabTagPushEvent,
  GitlabWikiPageEvent,
  WebhookOptions,
} from './type';

// Define event map for type safety
interface GitLabEventMap {
  pipeline: GitlabPipelineEvent;
  merge_request: GitlabMergeRequestEvent;
  note: GitlabNoteEvent;
  push: GitlabPushEvent;
  tag_push: GitlabTagPushEvent;
  issue: GitlabIssueEvent;
  job: GitlabJobEvent;
  deployment: GitlabDeploymentEvent;
  wiki_page: GitlabWikiPageEvent;
  release: GitlabReleaseEvent;
}

@Injectable()
export class WebhooksGitLab extends EventEmitter {
  private secret: string;

  constructor(options: WebhookOptions) {
    super();
    this.secret = options.secret;
  }

  // Method overloading for type safety
  on<K extends keyof GitLabEventMap>(event: K, listener: (payload: GitLabEventMap[K]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  // Method overloading for emit
  emit<K extends keyof GitLabEventMap>(event: K, payload: GitLabEventMap[K]): boolean;
  emit(event: string, ...args: any[]): boolean;
  emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  async verifyAndReceive(data: GitLabWebhookData): Promise<void> {
    if (!data.headers || data.headers['x-gitlab-token'] !== this.secret) {
      throw new Error('Invalid GitLab token');
    }

    const eventName = data.body.object_kind as GitLabEventName;

    this.emit(eventName, data.body);
  }
}
