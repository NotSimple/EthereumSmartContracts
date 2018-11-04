# Guia de deployment de Solidity Smart Contracts con Truffle

Esta guia busca explicar como hacer deployment de smartcontracts de Ethereum utilizando Truffle.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contenidos**

- [Truffle Suite](#truffle-suite)
  - [Que es Truffle?](#que-es-truffle)
  - [Que es Ganache?](#que-es-ganache)
- [Tutorial Deployment con Truffle + Ganache](#tutorial-deployment-con-truffle--ganache)
  - [Instalar Truffle](#instalar-truffle)
  - [Instalar Ganache](#instalar-ganache)
  - [Crear Proyecto](#crear-proyecto)
  - [Configurar Truffle](#configurar-truffle)
  - [Crear SmartContract](#crear-smartcontract)
  - [Crear Archivo de Migracion](#crear-archivo-de-migracion)
  - [Hacer Deployment](#hacer-deployment)
- [Go Ethereum (geth)](#go-ethereum-geth)
  - [Que es geth?](#que-es-geth)
  - [Instalar geth](#instalar-geth)
- [Tutorial Deployment con Truffle + Geth](#tutorial-deployment-con-truffle--geth)
  - [Crear Una TestNet Privada](#crear-una-testnet-privada)
  - [Crear archivo de genesis](#crear-archivo-de-genesis)
    - [Hacer correr el nodo](#hacer-correr-el-nodo)
  - [Deployment a Nuestra Testnet con Truffle](#deployment-a-nuestra-testnet-con-truffle)
    - [Configurar truffle con nuestra blockchain privada](#configurar-truffle-con-nuestra-blockchain-privada)
    - [Preparacion para Deployment](#preparacion-para-deployment)
    - [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Truffle Suite

## Que es Truffle?

Truffle es una herramienta para facilitar el desarrollo de smartcontracts en solidity. Te permite compilar solidity, hacer deployment a una red de ethereum de tu eleccion (local, testnet o mainnet) y realizar testing usando javascript.

## Que es Ganache?

Ganache es una herramienta que simula un blockchain de ethereum localmente.

# Tutorial Deployment con Truffle + Ganache

En este tutorial, crearemos un contrato simple en solidity que te permite guardar un valor asociado a ti, que cualquiera puede revisar, pero solo tu puedes cambiar. Usaremos las herramientas truffle y ganache para esto.

Antes de empezar, se recomienda:

- Saber trabajar en la linea de comandos
- Algo de familiaridad con [npm](https://www.npmjs.com)

## Instalar Truffle

En la linea de comando ejecutar:
```
npm install -g truffle
```
La documentacion se puede encontrar en http://truffleframework.com/docs/getting_started/installation

## Instalar Ganache

Descarga Ganache con GUI de su pagina oficial: https://truffleframework.com/ganache

Como nota, tambien existe una interfaz de linea de comandos ([ganache-cli](https://github.com/trufflesuite/ganache-cli)), pero en este tutorial usaremos el GUI.

## Crear Proyecto

Para comenzar, crearemos una carpeta nueva para el proyecto.

Para crear un proyecto truffle ejecutamos lo siguiente dentro del directorio que acabamos de crear:

```
truffle init
```

Esto descarga algunos archivos necesarios para el proyecto truffle.

Apareceran dos archivos de configuracion: truffle.js y truffle-config.js. Truffle reconoce a cualquiera de los dos como archivo de configuracion asi que borra uno y usa el otro. Si estas usando windows, debes borrar truffle.js ya que este sistema operativo tiene un problema de nombres y cuando intentas ejecutar comandos de truffle abrira truffle.js.

## Configurar Truffle

Abre tu archivo de configuracion (truffle.js o truffle-config.js) y escribe lo siguiente y guardalo:

```
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
```
Esto configura a truffle para conectarse con la simulacion de blockchain de Ganache.

## Crear SmartContract

Luego, crearemos un smart contract. Ejecuta:

```
truffle create contract StoreValue
```
Esto crea un archivo StoreValue.sol en la carpeta contracts con un codigo basico.

Luego abre este archivo y escribe lo siguiente y guarda tus cambios:

```
pragma solidity ^0.4.22;


contract StoreValue{
    mapping (address => uint) value_stored;

    function updateMyValue(uint value) public{
        value_stored[msg.sender] = value;
    }

    function retrieveValue(address owner) public view returns (uint) {
        return value_stored[owner];
    }
}
```

Este es un contrato simple que te permite guardar un valor asociado a tu cuenta ethereum y retirar el valor que haya guardado alguien sabiendo su _address_.

## Crear Archivo de Migracion

Para realizar el deployment o migracion en truffle se deben crear archivos de migracion que le indican con que archivos y en que orden se hara el deployment.

Para crear el archivo de migracion de nuestro contrato StoreValue, ejecuta:

```
truffle create migration StoreValue
```
Esto creara un archivo cuyo nombre empieza con un timestamp y termina con '_store_value.js' en la carpeta migrations.

En este archivo escribe y guarda:

```
const StoreValue = artifacts.require('./StoreValue.sol');

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(StoreValue);
};
```

Con esto le declaramos a truffle los detalles del deployment que 
## Hacer Deployment

Corramos ganache para simular la blockchain de ethereum localmente.

Luego de asegurar que ganache esta funcionando correctamente, estamos listo para hacer el deployment. Ejecuta:

```
truffle deploy
```

Este comando automaticamente realiza la compilacion de condigo solidity y hace el deployment a la unica red que tenemos configurada, ganache.

Si observas en ganache podras ver que hay unas transacciones nuevas que son las realizadas con el deployment.

Con esto hemos realizado un deployment local de un smart contract en ethereum, usando Truffle y Ganache. Ahora veremos como realizar deployment a una testnet privada.

# Go Ethereum (geth)

## Que es geth?

Es la implementacion oficial del protocolo de ethereum en el lenguaje de programacion Go. Puedes leer mas en su pagina oficial: https://geth.ethereum.org

## Instalar geth

Puedes descargar geth para tu sistema operativos desde la pagina oficial en https://geth.ethereum.org/downloads/

# Tutorial Deployment con Truffle + Geth

Primero debemos asegurar que este instalado geth. Asumiremos que se tiene creado un proyecto en Truffle como el de la seccion 'Tutorial deployment con Truffle + Ganache'.

Crearemos una testnet privada utilizando geth y luego haremos deployment a ella desde truffle.

## Crear Una TestNet Privada

A continuacion crearemos una testnet privada de forma rapida. Para un tutorial un poco mas detallado de como hacer esto, ver https://hackernoon.com/heres-how-i-built-a-private-blockchain-network-and-you-can-too-62ca7db556c0.

## Crear archivo de genesis

Para crear una testnet privado, lo primero que debemos hacer es crear el bloque genesis de nuestra blockchain. Para hacer esto debemos crear un archivo genesis.

Entonces, en nuestro caso crearemos un archivo CustomGenesis.json con el siguiente contenido:

```
{
  "config": {
    "chainId": 78987,
    "HomesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "alloc": {}
  "difficulty": "0x400",
  "gasLimit": "0x8000000",

}
```
Deberias elegir un numero al azar para el parametro chainId para que nadie se conecte sin querer a tu red.

Luego ejecutemos:
```
geth --datadir "path/to/PrivateChainDataDir" init "/path/to/CustomGenesis.json"
```
donde el argumento del flag datadir es el path a un directorio donde se guarda la data de la blockchain (data que es generada la primera vez que se corre este comando) y el argumento al comando init es el path al archivo de genesis.

Con esto queda escrito el primer bloque de la blockchain.

### Hacer correr el nodo

Para correr tu propio nodo ejecuta:

```
geth --datadir "path/to/PrivateChainDataDir" --rpc
```
donde el argumento de, flag datadir es el path a un directorio donde se guarda la data de la blockchain y el flag rpc te permite conectarte remotamente al nodo.
## Deployment a Nuestra Testnet con Truffle

### Configurar truffle con nuestra blockchain privada

Primero debemos entrar a la configuracion de truffle y agregar nuestra red. Entonces, el archivo de configuracion nos queda:

```
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    privateTestNet: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" 
    }
  }
};
```
donde el network privateTestNet es nuestra red.

### Preparacion para Deployment

Antes de realizar el deployment, debemos tener una 'cuenta' para realizar la transaccion en tu red privada. Esto lo podemos hacer a traves de la consola en javascript de geth. Para conectarte al nodo, mientras este esta corriendo, abre otra linea de comando y ejecuta:

```
geth attach --datadir "./PrivateChainDataDir"
```

Te deberia aparecer un mensaje de bienvenida a la consola.

En esta consola ejecuta:

```
personal.newAccount("password")
```

donde password es la clave que tu quieras.

Ahora para poder realizar transacciones, debes tener ether en tu chain privada. Entonces debes realizar mining; ejecuta:

```
miner.start()
```

Puedes ver el ether que vas acumulando con

```
eth.getBalance(eth.coinbase)
```

y puedes ejecutar

```
miner.stop()
```

cuando quieras terminar de hacer mining.

Luego, cuando tenga suficiente ether puedes realizar el deployment.

### Deployment

Ahora que esta listo el proyecto de Truffle  la Creacion de llaves en geth solo queda realizar el deployment.

Ejecuta en la consola  :

```
personal.unlockAccount(eth.coinbase)
```

e ingrese tu clave. Esto le permite a truffle realizar una transaccion con esta cuenta.

Ahora, en tu proyecto truffle ejecuta:

```
truffle deploy --network privateTestNet
```

Nota que debes estar haciendo mining para que el nuevo contrato sea aceptado a la blockchain.

Con esto has hecho un deployment exitoso a tu blockchain privada.