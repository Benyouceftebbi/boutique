'use client';
import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const searchParams = useSearchParams();

  const order = {
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    productName: searchParams.get('product') || '',
    productImage: searchParams.get('image') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
    quantity: Number(searchParams.get('qty')) || 1,
    productPrice: Number(searchParams.get('price')) || 0,
    shippingPrice: Number(searchParams.get('shipping')) || 0,
    total: Number(searchParams.get('total')) || 0,
    deliveryType: searchParams.get('delivery') || ''
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-center">
        <h1 className="text-2xl font-bold text-green-600">✅ تم تأكيد الطلب!</h1>
        <p className="text-lg">
          شكراً لك <strong>{order.name}</strong>، لقد استلمنا طلبك.
        </p>
        <p className="text-base text-gray-600 dark:text-gray-300">
          سيتصل بك وكيلنا على الرقم <strong>{order.phone}</strong> لتأكيد التفاصيل.
        </p>

        <div className="border-t border-gray-200 dark:border-slate-600 pt-4 text-right space-y-3 text-sm">
          <div className="flex space-x-4 rtl:space-x-reverse items-center">
            <div>
              <div className="font-semibold text-base">{order.productName}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">اللون: {order.color}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">المقاس: {order.size}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">الكمية: {order.quantity}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed space-y-1 text-sm">
            <div className="flex justify-between"><span>سعر الوحدة:</span><span>{order.productPrice.toLocaleString()} د.ج</span></div>
            <div className="flex justify-between"><span>سعر الشحن:</span><span>{order.shippingPrice.toLocaleString()} د.ج</span></div>
            <div className="flex justify-between"><span>نوع التوصيل:</span><span>{order.deliveryType}</span></div>
            <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>المجموع:</span><span>{order.total.toLocaleString()} د.ج</span></div>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
