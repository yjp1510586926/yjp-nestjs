import { Injectable } from '@nestjs/common';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage } from '../../client/src/pages/home/HomePage';
import { UsersPage } from '../../client/src/pages/users/UsersPage';

@Injectable()
export class RenderService {
	// biome-ignore lint/suspicious/noExplicitAny: 通用渲染方法
	renderHomePage(_initialData: any): string {
		return renderToString(React.createElement(HomePage));
	}

	renderUsersPage(): string {
		return renderToString(React.createElement(UsersPage));
	}
}
