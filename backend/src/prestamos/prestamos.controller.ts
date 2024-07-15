import { Controller, Get, Post, Body, Param, Delete, Patch, NotFoundException, Put, } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamosDto } from './dto/create-prestamos.dto';
import { AcceptRequest, ConfirmDeliver, ConfirmReturn, UpdatePracticaDto } from './dto/update-prestamos.dto';

@Controller('prestamos')
export class PracticasController {
  constructor(private readonly prestamosServices: PrestamosService) { }

  @Post()
  create(@Body() createPrestamosDto: CreatePrestamosDto) {
    return this.prestamosServices.create(createPrestamosDto);
  }

  @Get()
  findAll() {
    return this.prestamosServices.findAll();
  }

  @Get("/get-requests")
  async getRequests() {
    const res = await this.prestamosServices.getRequests();
    if(!res) throw new NotFoundException("No hay solicitudes pendientes");
    return res;
  }

  @Get("/get-rejected-requests")
  async getRejectedRequests() {
    const res = await this.prestamosServices.getRejectedRequests();
    if(!res) throw new NotFoundException("No hay solicitudes rechazadas.");
    return res;
  }

  @Get("/get-not-deliveries")
  async getNotDeliveries() {
    const res = await this.prestamosServices.getNotDeliveries();
    if(!res) throw new NotFoundException("Todas las solicitudes han sido entregadas.");
    return res;
  }

  @Get("/get-not-return")
  async getNotReturn() {
    const res = await this.prestamosServices.getNotReturn();
    if(!res) throw new NotFoundException("Todas las solicitudes han sido devueltas.");
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.prestamosServices.findOne(id);
    if(!res) throw new NotFoundException("El prestamo no se encuentra registrado o fue borrado.")
    return res;
  }

  @Get('prestamos-alumno/:id')
  async findByAlumno(@Param('id') id: string) {
    const res = await this.prestamosServices.findByAlumno(id);
    if(!res) throw new NotFoundException("El prestamo no se encuentra registrado o fue borrado.")
    return res;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePracticaDto: UpdatePracticaDto) {
    const res = await this.prestamosServices.update(id, updatePracticaDto);
    if (!res) throw new NotFoundException("La practica no se encuentra registrada.");
    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await  this.prestamosServices.remove(id);
    if(!res) throw new NotFoundException("El prestamo no se encuentra registrado.");
    return res;
  }

  @Put("/accept-request")
  async acceptRequest(@Body() acceptData: AcceptRequest) {
    return await this.prestamosServices.acceptRequest(acceptData);
  }

  @Put("/confirm-delivery")
  async confirmDelivery(@Body() confirmData: ConfirmDeliver) {
      const res = await this.prestamosServices.confirmDeliver(confirmData);
      if(!res) throw new NotFoundException("El prestamo no existe.");
      return res;
  }

  @Put("/confirm-return")
  async confirmReturn(@Body() confirmData: ConfirmReturn) {
      const res = await this.prestamosServices.confirmReturn(confirmData);
      if(!res) throw new NotFoundException("El prestamo no existe.");
      return res;
  }
}
