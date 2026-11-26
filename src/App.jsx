import React from 'react';
import {Routes,Route,Navigate,useLocation,Link} from 'react-router-dom';
import {Guard} from './components/Common';
import IndexPage from './pages/IndexPage';
import InstitucionPage from './pages/InstitucionPage';
import ActualidadPage from './pages/ActualidadPage';
import ServiciosPage from './pages/ServiciosPage';
import ComoFuncionaPage from './pages/ComoFuncionaPage';
import ContactoPage from './pages/ContactoPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import ConsultaPage from './pages/ConsultaPage';
import ActualizarPage from './pages/ActualizarPage';
import PagoPage from './pages/PagoPage';
import ComprobantePage from './pages/ComprobantePage';
import PanelPage from './pages/PanelPage';
import CajaPage from './pages/CajaPage';
import ReportesPage from './pages/ReportesPage';
import UsuariosPage from './pages/UsuariosPage';
const client=['cliente'],staff=['administrador','empleado'],admin=['administrador'];
const entries=[['/',IndexPage],['/institucion',InstitucionPage],['/actualidad',ActualidadPage],['/servicios',ServiciosPage],['/como-funciona',ComoFuncionaPage],['/contacto',ContactoPage],['/login',LoginPage],['/registro',RegistroPage,client],['/consulta',ConsultaPage,client],['/actualizar',ActualizarPage,client],['/pago',PagoPage,client],['/comprobante',ComprobantePage,['cliente','administrador','empleado','cajero']],['/panel',PanelPage,staff],['/caja',CajaPage,['administrador','cajero']],['/reportes',ReportesPage,admin],['/usuarios',UsuariosPage,admin]];
function Legacy({to}){const loc=useLocation();return <Navigate replace to={to+loc.search+loc.hash}/>;}
export default function App(){return <Routes>{entries.map(([path,Component,roles])=><Route key={path} path={path} element={roles?<Guard roles={roles}><Component/></Guard>:<Component/>}/>)}{entries.filter(([path])=>path!=='/usuarios').map(([path])=><Route key={path+'.html'} path={path==='/'?'/index.html':path+'.html'} element={<Legacy to={path}/>}/>)}<Route path="*" element={<main><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></main>}/></Routes>;}
