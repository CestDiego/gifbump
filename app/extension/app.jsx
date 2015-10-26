import 'styles/extensions.scss';

import { GIF } 	from 'gif.js'
import React 	from 'react'
import ReactDOM from 'react-dom'

// Router
import {Router, Route, Link} from 'react-router'

// Controllers
import history from './controllers/history'

// Components
import Preview from './components/Preview'

// Routes
import Index 			from './routes/Index'
import Permission from './routes/Permission'
import Capture    from './routes/Capture'

// Render app container
ReactDOM.render(
	<div className="app flicker scanlines">
		<Preview/>
		<div className="cover">
			<Router history={history}>
				<Route path="/capture"    component={ Capture }/>
				<Route path="/permission" component={ Permission }/>
				<Route path="*"           component={ Index }/>
			</Router>
		</div>
	</div>,
  document.getElementById('container')
)


/*
	New Routes
*/ 

// <Route path="/capture" 	  component={ Capture }/>
// <Route path="/preview" 	  component={ Preview }/>
// <Route path="/upload"     component={ Upload }/>
// <Route path="/share"      component={ Share }/>