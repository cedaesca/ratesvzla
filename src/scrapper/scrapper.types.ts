export interface GetTextContentOptions {
  url: string;
  selector: string;
}

export interface GetMultipleTextContentsOptions {
  url: string;
  selectors: {
    [key: string]: string;
  };
}

export interface MultipleTextContentsResult {
  [key: string]: string;
}
