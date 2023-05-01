import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvailableRole } from '@project/contracts';
import { Http, ConfigNamespace } from '@project/services';

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly http: Http,
    private readonly configService: ConfigService
  ) {}

  /**
   * Получение списка отзывов в разрезе роли
   * @param id Идентификатор роли
   * @param role Роль пользователя
   * @returns Список отзывов
   */
  async getList(id: string, role: AvailableRole) {
    const { urlServiceReview } = this.configService.get(ConfigNamespace.Common);
    const { data } = await this.http.get(
      `${urlServiceReview}/${id}?role=${role}`
    );

    return data;
  }
}