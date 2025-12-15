import { Injectable } from '@nestjs/common';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage } from '../../client/src/pages/home/HomePage';

@Injectable()
export class RenderService {
  renderHomePage(initialData: any): string {
    return renderToString(
      React.createElement(HomePage, { initialData }),
    );
  }
}
