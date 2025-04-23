import "../styles/globals.scss";
import "../styles/Home/index.scss";
import '../styles/Login/index.scss';
import '../styles/Dashboard/ds.scss';
import '../styles/Nav/index.scss';
import '../styles/components/card.scss'
import '../styles/Setting/setting.scss'
import '../styles/Report/report.scss'
import '../styles/DateSection/DateSection.scss'
import '../styles/DateSection/ReportCard.scss'
import '../styles/Loding/Loding.scss'
import '../styles/Project/Project.scss'
import '../styles/Notification/index.scss'
import '../styles/Chart/index.scss'


import { Provider } from 'jotai';

import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
    return ( < Provider > < Component {...pageProps }
        /> </Provider > );
}

export default MyApp;