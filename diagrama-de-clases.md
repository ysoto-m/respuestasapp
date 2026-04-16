# Diagrama de Clases del Sistema

## Objetivo

Este documento presenta un diagrama de clases conceptual del sistema web del taller mecanico. El enfoque no es mostrar metodos de programacion internos, sino las entidades principales del dominio y la forma en que se relacionan mediante cardinalidades como `1:1`, `1:N` y `N:M`.

El diagrama se construyo en coherencia con el modelo definido en [schema.sql](/C:/Users/yufri/Documents/automotrices/database/schema.sql).

## Convenciones de cardinalidad

- `1`: relacion obligatoria con una sola instancia.
- `0..1`: relacion opcional con una sola instancia.
- `0..*`: relacion opcional con muchas instancias.
- Las relaciones `N:M` se resuelven mediante clases intermedias o tablas detalle.

## Diagrama UML en Mermaid

```mermaid
classDiagram
    direction LR

    class Rol {
        +id
        +nombre
        +descripcion
        +estado
    }

    class Usuario {
        +id
        +rol_id
        +mecanico_id
        +username
        +nombres
        +apellidos
        +email
        +estado
    }

    class Mecanico {
        +id
        +nombres
        +apellidos
        +especialidad
        +telefono
        +correo
        +estado
    }

    class Cliente {
        +id
        +nombres
        +apellidos
        +dni
        +telefono
        +correo
        +estado
    }

    class Vehiculo {
        +id
        +cliente_id
        +placa
        +marca
        +modelo
        +anio
        +vin
        +kilometraje
        +estado
    }

    class Servicio {
        +id
        +nombre
        +descripcion
        +duracion_estimada
        +estado
    }

    class Cita {
        +id
        +cliente_id
        +vehiculo_id
        +servicio_id
        +creado_por
        +fecha_hora
        +motivo
        +estado
    }

    class OrdenTrabajo {
        +id
        +codigo
        +cita_id
        +cliente_id
        +vehiculo_id
        +mecanico_id
        +creado_por
        +fecha_ingreso
        +fecha_salida
        +diagnostico
        +observaciones
        +estado
        +prioridad
    }

    class OrdenServicioDetalle {
        +id
        +orden_id
        +servicio_id
        +observacion
    }

    class Repuesto {
        +id
        +codigo
        +nombre
        +stock
        +stock_minimo
        +unidad_medida
        +estado
    }

    class OrdenRepuestoDetalle {
        +id
        +orden_id
        +repuesto_id
        +cantidad
        +observacion
    }

    class HistorialEstadoCita {
        +id
        +cita_id
        +estado_anterior
        +estado_nuevo
        +changed_by
        +created_at
    }

    class HistorialEstadoOrden {
        +id
        +orden_id
        +estado_anterior
        +estado_nuevo
        +changed_by
        +created_at
    }

    Rol "1" --> "0..*" Usuario : asigna
    Usuario "0..1" --> "0..1" Mecanico : vincula

    Cliente "1" --> "0..*" Vehiculo : posee
    Cliente "1" --> "0..*" Cita : agenda
    Vehiculo "1" --> "0..*" Cita : recibe
    Servicio "1" --> "0..*" Cita : solicitado
    Usuario "0..1" --> "0..*" Cita : registra

    Cita "0..1" --> "0..1" OrdenTrabajo : origina
    Cliente "1" --> "0..*" OrdenTrabajo : solicita
    Vehiculo "1" --> "0..*" OrdenTrabajo : ingresa
    Mecanico "0..1" --> "0..*" OrdenTrabajo : atiende
    Usuario "0..1" --> "0..*" OrdenTrabajo : crea

    OrdenTrabajo "1" *-- "0..*" OrdenServicioDetalle : incluye
    Servicio "1" --> "0..*" OrdenServicioDetalle : referencia

    OrdenTrabajo "1" *-- "0..*" OrdenRepuestoDetalle : consume
    Repuesto "1" --> "0..*" OrdenRepuestoDetalle : participa

    Cita "1" *-- "0..*" HistorialEstadoCita : registra
    Usuario "0..1" --> "0..*" HistorialEstadoCita : cambia

    OrdenTrabajo "1" *-- "0..*" HistorialEstadoOrden : registra
    Usuario "0..1" --> "0..*" HistorialEstadoOrden : cambia
```

## Relaciones principales explicadas

### Relaciones 1 a muchos

- Un `Rol` puede tener muchos `Usuario`.
- Un `Cliente` puede tener muchos `Vehiculo`.
- Un `Cliente` puede registrar muchas `Cita`.
- Un `Vehiculo` puede tener muchas `Cita`.
- Un `Servicio` puede estar asociado a muchas `Cita`.
- Un `Cliente` puede tener muchas `OrdenTrabajo`.
- Un `Vehiculo` puede aparecer en muchas `OrdenTrabajo`.
- Un `Mecanico` puede atender muchas `OrdenTrabajo`.
- Una `OrdenTrabajo` puede tener muchos registros en `HistorialEstadoOrden`.
- Una `Cita` puede tener muchos registros en `HistorialEstadoCita`.

### Relaciones 1 a 1 u opcionales

- `Usuario` y `Mecanico` mantienen una relacion `0..1 : 0..1`.
- Esto significa que no todo usuario necesita estar vinculado a un mecanico.
- Tambien significa que puede existir un mecanico registrado sin acceso al sistema.
- `Cita` y `OrdenTrabajo` mantienen una relacion `0..1 : 0..1`.
- Una orden puede originarse desde una cita, pero tambien puede crearse manualmente.

### Relaciones muchos a muchos resueltas

- `OrdenTrabajo` y `Servicio` forman una relacion `N:M`, resuelta por `OrdenServicioDetalle`.
- `OrdenTrabajo` y `Repuesto` forman una relacion `N:M`, resuelta por `OrdenRepuestoDetalle`.

## Lectura academica del modelo

Este diagrama refleja una separacion correcta entre entidades operativas y entidades de acceso:

- `Usuario` representa la cuenta que inicia sesion y posee permisos.
- `Mecanico` representa al recurso humano operativo del taller.
- La vinculacion opcional entre ambas clases permite que el sistema siga siendo flexible y mas cercano a un escenario real.

Ademas, el uso de clases detalle permite modelar correctamente procesos del taller:

- una orden puede incluir varios servicios,
- una orden puede consumir varios repuestos,
- y un mismo servicio o repuesto puede repetirse en distintas ordenes sin duplicar informacion maestra.

## Uso recomendado en el informe

Este archivo puede utilizarse directamente en la parte de analisis o diseno del proyecto, especialmente en secciones como:

- modelo conceptual,
- diagrama de clases,
- relaciones entre entidades,
- reglas del negocio,
- sustento de la base de datos relacional.
