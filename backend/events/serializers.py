from rest_framework import serializers
from .models import Events, EventParticipant

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = [
            'id', 'title_en', 'title_jp', 'description_en', 'description_jp', 'location',
            'date', 'start_time', 'end_time', 'cover_image', 
            # 'created_by', 'updated_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
        )

class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipant
        fields = [
            'id', 'event', 'user', 'joined_at'
        ]
        read_only_fields = (
            'id',
            'joined_at',
        )
        