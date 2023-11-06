import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import Subscriber from './subscribers.service';

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  getAllSubscribers(params: unknown): Promise<{ data: Subscriber[] }>;
}

export default SubscribersService;
