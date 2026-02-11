from django.urls import path
from .views import EventListCreateView, MyJoinedEventsView, EventParticipantListView, EventJoinView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event_list'),
    path('my-joined/', MyJoinedEventsView.as_view(), name='my_joined_events'),
    path('<int:event_id>/participants/', EventParticipantListView.as_view(), name='event_participants'),
    path('<int:event_id>/join/', EventJoinView.as_view(), name='event-join'),
]