# Spec Delta

## Purpose

Permite a los visitantes del sitio web configurar y solicitar cotizaciones personalizadas de decoracion para sus eventos, enlazando directamente con la linea de WhatsApp del negocio.

## ADDED Requirements

### Requirement: Formulario de cotizacion interactiva
The system SHALL presentar un formulario interactivo con campos obligatorios para tipo de evento, fecha estimada, cantidad aproximada de invitados y presupuesto aproximado.

#### Scenario: Envio de formulario con datos completos
- **WHEN** el usuario completa todos los campos requeridos y presiona "Solicitar Cotizacion"
- **THEN** el sistema valida los datos y habilita la generacion del mensaje de contacto

### Requirement: Generacion de enlace a WhatsApp
The system SHALL construir un enlace con protocolo `https://wa.me/` que incluya el texto formateado con los datos de la cotizacion para abrir la conversacion directamente.

#### Scenario: Redireccion a WhatsApp con resumen preformateado
- **WHEN** el usuario confirma la solicitud en el modal de cotizacion
- **THEN** el sistema abre WhatsApp en una nueva pestana con el mensaje estructurado listo para enviar
