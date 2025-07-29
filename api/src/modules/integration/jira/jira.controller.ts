import { Controller } from '@nestjs/common';
import { JiraService } from './jira.service';

@Controller('integrations/jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}
}
