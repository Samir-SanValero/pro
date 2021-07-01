import { Injectable } from '@angular/core';
import { TemplateFavourite } from '../../models/report-model';

@Injectable({ providedIn: 'root' })
export class TemplateFavouriteService {

  constructor() {

  }

  listTemplateFavourite(): Array<TemplateFavourite> {
    return new Array<TemplateFavourite>();
  }

  createTemplateFavourite(templateFavourite: TemplateFavourite): void {

  }

  updateTemplateFavourite(templateFavourite: TemplateFavourite): void {

  }

  deleteTemplateFavourite(templateFavourite: TemplateFavourite): void {

  }

  searchTemplateFavourite(templateFavouriteId: number): TemplateFavourite{
    return new TemplateFavourite();
  }

  searchTemplateFavouriteByReportNameAndLanguage(reportName: string, language: string): TemplateFavourite {
    return new TemplateFavourite();
  }
}
