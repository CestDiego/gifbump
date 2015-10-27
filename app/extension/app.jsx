import 'styles/extensions.scss';

import React 	from 'react';
import ReactDOM from 'react-dom';

// Router
import {Router, Route} from 'react-router';

// Controllers
import history from './controllers/history';

// Components
import Media from './components/Media';

// Routes
import Index 			from './routes/Index';
import Permission from './routes/Permission';
import Capture    from './routes/Capture';
import Share      from './routes/Share';
import Preview    from './routes/Preview';
import Cloud      from './routes/SomeoneElsesComputer';

// Render app container
ReactDOM.render(
	<div className="app flicker scanlines">
		<Media/>
		<div className="cover">
			<Router history={history}>
				<Route path="/upload"     component={ Cloud }/>
        <Route path="/share"      component={ Share }/>
        <Route path="/preview"    component={ Preview }/>
				<Route path="/capture"    component={ Capture }/>
				<Route path="/permission" component={ Permission }/>
				<Route path="*"           component={ Index }/>
			</Router>
		</div>
	</div>,
  document.getElementById('container')
);

/*
	New Routes
*/

// <Route path="/capture" 	  component={ Capture }/>
// <Route path="/preview" 	  component={ Preview }/>
// <Route path="/upload"     component={ Upload }/>
// <Route path="/share"      component={ Share }/>
