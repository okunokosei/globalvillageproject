from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers

User = get_user_model()

class FinalUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'name',
            'password',
            'room_number',
            'move_in_date',
            'move_out_date',
            'icon'
        )


class CustomUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            'id',
            'email',
            'name',
            'room_number',
            'role',
            'position',
            'language_preference',
            'move_in_date',
            'move_out_date',
            'is_active',
            'is_staff',
            'icon'
        )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'room_number', 'language_preference', 'move_in_date', 'move_out_date', 'icon', ]
        read_only_fields = ['id', 'email', 'room_number', 'move_in_date', 'move_out_date', ]