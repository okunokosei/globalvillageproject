from rest_framework import serializers
from .models import Events, EventParticipant

class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")
    start_time = serializers.TimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")
    is_joined = serializers.SerializerMethodField()
    # SerializerMethodField は read_only_fields である。
    class Meta:
        model = Events
        fields = [
            'id', 'title_en', 'title_jp', 'description_en', 'description_jp', 'location',
            'date', 'start_time', 'end_time', 'cover_image', 'is_joined',
            # 'created_by', 'updated_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
        )
    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(id=request.user.id).exists()
        return False


class ParticipantListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    room_number = serializers.CharField(source='user.room_number')
    class Meta:
        model = EventParticipant
        fields = ['id', 'name', 'room_number']
