from django.urls import path
from .views import EventListView, EventParticipantListView

urlpatterns = [
    path('events-detail/', EventListView.as_view(), name='event_list'),
    path('events-participant/', EventParticipantListView.as_view, name='events_participant'),
]