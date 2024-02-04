import {
  OrderStatus
} from '../enums';
import {
  OrderInterface
} from '../interfaces';
import {
  UserModel
} from './user.model';

export class OrderModel implements OrderInterface {
  _id: string;
  user: UserModel;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  purchases: Record<string, number>;
  status: OrderStatus;
  isSelfPickup: boolean;
  totalPurchaseAmount: number;
  shippingCharge: number;
  whenCreated: number;
  whenLastUpdated: number;

  constructor(data: Partial<OrderInterface> | Partial<OrderModel> = {
    _id: '',
    user: new UserModel(),
    razorpayOrderId: '',
    razorpayPaymentId: '',
    razorpaySignature: '',
    purchases: {},
    status: OrderStatus.PENDING,
    isSelfPickup: false,
    totalPurchaseAmount: 0,
    shippingCharge: 0,
    whenCreated: Date.now(),
    whenLastUpdated: Date.now(),
  }) {
    this._id = data?._id || '';
    this.user = data?.user ? new UserModel(data?.user) : new UserModel();
    this.razorpayOrderId = data?.razorpayOrderId || '';
    this.razorpayPaymentId = data?.razorpayPaymentId || '';
    this.razorpaySignature = data?.razorpaySignature || '';
    this.purchases = data?.purchases || {};
    this.status = data?.status || OrderStatus.PENDING;
    this.isSelfPickup = data?.isSelfPickup || false;
    this.totalPurchaseAmount = data?.totalPurchaseAmount || 0;
    this.shippingCharge = data?.shippingCharge || 0;

    this.whenCreated = data?.whenCreated || Date.now();
    this.whenLastUpdated = data?.whenLastUpdated || Date.now();
  }
};
