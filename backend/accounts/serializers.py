from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer as BaseUserSerializer

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