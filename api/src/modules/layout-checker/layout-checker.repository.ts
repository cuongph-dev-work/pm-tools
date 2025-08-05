import { LayoutCheckerVersion } from '@entities/layout-checker-version.entity';
import { LayoutChecker } from '@entities/layout-checker.entity';
import { Project } from '@entities/project.entity';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateLayoutCheckerDto } from './dtos/create.dto';

@Injectable()
export class LayoutCheckerRepository extends EntityRepository<LayoutChecker> {
  constructor(em: EntityManager) {
    super(em, LayoutChecker);
  }

  async createNewLayoutChecker(body: CreateLayoutCheckerDto & { diffPixelUrl: string }, project: Project) {
    const layoutChecker = await this.em.findOne(LayoutChecker, {
      website_url: body.websiteUrl,
      figma_url: body.figmaUrl,
      figma_token: body.figmaToken,
      project: { id: project.id },
    });

    if (layoutChecker) {
      const layoutCheckerVersion = await this.em.findOne(LayoutCheckerVersion, {
        layout_checker: { id: layoutChecker.id },
      });
      if (layoutCheckerVersion) {
        layoutCheckerVersion.diff_pixel_url = body.diffPixelUrl;
        layoutCheckerVersion.version = layoutCheckerVersion.version + 1;
        await this.em.persistAndFlush(layoutCheckerVersion);
      }
    } else {
      const version = '1';
      const layoutChecker = new LayoutChecker();
      layoutChecker.figma_token = body.figmaToken;
      layoutChecker.figma_url = body.figmaUrl;
      layoutChecker.website_url = body.websiteUrl;
      layoutChecker.project = project;
      const layoutCheckerVersion = new LayoutCheckerVersion();
      layoutCheckerVersion.version = version;
      layoutCheckerVersion.layout_checker = layoutChecker;
      layoutCheckerVersion.diff_pixel_url = body.diffPixelUrl;
      await this.em.persistAndFlush([layoutChecker, layoutCheckerVersion]);
    }
  }
}
