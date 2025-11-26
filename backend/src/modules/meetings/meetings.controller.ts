import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) { }

  @Post()
  createMeeting(@Body() createMeetingDto: any) {
    return this.meetingsService.createMeeting(createMeetingDto);
  }

  @Get()
  getAllMeetings() {
    return this.meetingsService.getAllMeetings();
  }

  @Get('user/:userId')
  getMeetingsByUser(@Param('userId') userId: string) {
    return this.meetingsService.getMeetingsByUser(userId);
  }
}
