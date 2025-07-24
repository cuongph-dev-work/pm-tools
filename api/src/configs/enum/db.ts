export enum USER_ROLE {
  ADMIN = 'ADMIN', // system admin
  PM = 'PROJECT_MANAGER', // project manager
  DEVELOPER = 'DEVELOPER', // developer
  QA = 'QUALITY_ASSURANCE', // quality assurance
  QC = 'QUALITY_CONTROL', // tester
  BR_COMT = 'BRSE_COMTOR', // Bridge Software Engineer
}

export enum PROJECT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MEMBER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEFT = 'LEFT',
}

export enum PROJECT_ROLE {
  PROJECT_MANAGER = 'PROJECT_MANAGER', // project manager
  DEVELOPER = 'DEVELOPER', // developer
  QA = 'QUALITY_ASSURANCE', // quality assurance
  QC = 'QUALITY_CONTROL', // tester
  BRSE_COMTOR = 'BRSE_COMTOR', // Bridge Software Engineer
}

export enum INVITE_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}
