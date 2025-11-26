import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  createNotification(@Body() createNotificationDto: any) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Get()
  getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get('user/:userId')
  getNotificationsByUser(@Param('userId') userId: string) {
    return this.notificationsService.getNotificationsByUser(userId);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
