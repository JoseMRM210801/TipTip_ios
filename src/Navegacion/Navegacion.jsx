import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../Login/Login';
import { TipoRegistro } from '../Login/TipoRegistro';
import { RegistroCliente } from '../Login/RegistroCliente';
import { RegistroProveedor } from '../Login/RegistroProveedor';
import { InicioCliente } from '../Inicio/InicioCliente';
import { BotonPropina } from '../Propina/BotonPropina';
import { DatosCliente } from '../Inicio/ClienteDatos';
import { PantallaScanner } from '../Inicio/PantallaScanner';
import { PantallaExito } from '../Inicio/PantallaExito';
import { ClienteCuenta } from '../Inicio/ClienteCuenta';
import { InicioRepartidor } from '../InicioRepartidor/InicioRepartidor';
import { LoginCredenciales } from '../Login/LoginCredenciales';
import { AccionesAdmin } from '../Admin/AccionesAdmin';
import { RevisionPropinas } from '../Admin/RevisionPropinas';
import { useContext } from 'react';
import { AppContext } from '../Contexto/AppContext';
import { ResumenTransacciones } from '../Admin/ResumenTransacciones';
import { DetallesPropinasCliente } from '../Admin/DetallesPropinasCliente';
import { DetallesPropinasRepartidor } from '../Admin/DetallesPropinasRepartidor';
import { PantallaQr } from '../InicioRepartidor/PantallaQr';
import { CuentaRepartidor } from '../InicioRepartidor/CuentaRepartidor';
import { DatosRepartidor } from '../InicioRepartidor/DatosRepartidor';
import { LectorQR } from '../InicioRepartidor/LectorQR';
import { TerminosyCondiciones } from '../Terminos/Terminso';
import { EliminarCliente } from '../Inicio/EliminarCliente';
import { ResetPassword } from '../Login/ResetPassword';
import { LectorQRPrueba } from '../InicioRepartidor/LectorQRPrueba';
import { PruebaQR } from '../InicioRepartidor/PruebaQR';


const Stack = createStackNavigator();

export function Navegacion() {
    const contexto = useContext(AppContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Credenciales" component={LoginCredenciales} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="TipoRegistro" component={TipoRegistro} />
            <Stack.Screen name="RegistroCliente" component={RegistroCliente} />
            <Stack.Screen name="RegistroProveedor" component={RegistroProveedor} />
            <Stack.Screen name="InicioCliente" component={InicioCliente} />
            <Stack.Screen name="BotonPropina" component={BotonPropina} />
            <Stack.Screen name="DatosCliente" component={DatosCliente} />
            <Stack.Screen name="CuentaCliente" component={ClienteCuenta} />
            <Stack.Screen name="PantallaScanner" component={PantallaScanner} />
            <Stack.Screen name="PantallaExito" component={PantallaExito} />
            <Stack.Screen name="InicioRepartidor" component={InicioRepartidor} />
            <Stack.Screen name="PantallaQr" component={PantallaQr} />
            <Stack.Screen name="LectorQR" component={LectorQR} />
            <Stack.Screen name="InicioAdministrador" component={AccionesAdmin} />
            <Stack.Screen name="RevisionPropinasAdmin" component={RevisionPropinas} />
            <Stack.Screen name="ResumenTransaccionesAdmin" component={ResumenTransacciones} />
            <Stack.Screen name="DeatllesPropinaCliente" component={DetallesPropinasCliente} />
            <Stack.Screen name="DeatllesPropinaRepartidor" component={DetallesPropinasRepartidor} />
            <Stack.Screen name="CuentaRepartidor" component={CuentaRepartidor} />
            <Stack.Screen name="DatosRepartidor" component={DatosRepartidor}/>
            <Stack.Screen name="TerminosyCondiciones" component={TerminosyCondiciones}/>
            <Stack.Screen name="EliminarCliente" component={EliminarCliente}/>
            <Stack.Screen name="LectorQRPrueba" component={LectorQRPrueba}/>
            <Stack.Screen name="PruebaQR" component={PruebaQR}/>
        </Stack.Navigator>
    );
}