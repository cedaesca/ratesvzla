export interface GetTextContentOptions {
  url: string;
  selector: string;
}

export interface GetMultipleTextContentsOptions {
  url: string;
  selectors: ScrapperSelector;
}

export interface MultipleTextContentsResult {
  [key: string]: string;
}

export interface ScrapperSelector {
  [key: string]: string;
}
