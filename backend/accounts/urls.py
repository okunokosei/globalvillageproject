from django.urls import path
from .views import UserProfileView, DeactivateAccountView

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('me/deactivate/', DeactivateAccountView.as_view(), name='user_deactivate'),
]
