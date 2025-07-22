import '@emotion/react';
declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primaryText: string;
      primaryBackground: string;
      defaultText: string;
      sepiaText: string;
      defaultTextFilter: string;
      defaultSelected: string;
      defaultUnselected: string;
    };
  }
}
