import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  withCompany<T extends Record<string, any>>(
    args: T,
    companyId: string,
  ): T {
    if (!args.where) {
      return {
        ...args,
        where: { companyId },
      };
    }

    return {
      ...args,
      where: {
        AND: [
          args.where,
          { companyId },
        ],
      },
    };
  }
}