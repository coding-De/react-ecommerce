import React, { useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectCartStatus, selectItems, updateCartAsync } from '../features/Cart/EcomCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'react-loader-spinner';
import { useForm } from 'react-hook-form';
import { createOrderAsync, selectCurrentOrder } from '../features/order/orderSlice';
import { selectUserInfo, updateUserAsync } from '../features/user/userSlice';
import Modal from '../features/common/Modal';

export default function Checkout() {
    const [open, setOpen] = useState(false);
    const user = useSelector(selectUserInfo);
    const currentOrder = useSelector(selectCurrentOrder);
    const status = useSelector(selectCartStatus);
    const items = useSelector(selectItems);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const totalAmount = items.reduce(
        (amount, item) => item.discountPercentage * item.item.quantity + amount,
        0
    );
    const totalItems = items.reduce((total, item) => item.item.quantity + total, 0);

    const handleQuantity = (e, item) => {
        e.preventDefault()
        dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
    };

    const deleteItem = useRef(null);
    const handleRemove = () => {
        dispatch(deleteItemFromCartAsync(deleteItem.current));
        setOpen(false)
    };

    const handleModal = (id) => {
        setOpen(true)
        deleteItem.current = id;
    };

    const handleAddress = (e) => {
        console.log(e.target.value);
        setSelectedAddress(user.addresses[e.target.value]);
    };

    const handlePayment = (e) => {
        console.log(e.target.value);
        setPaymentMethod(e.target.value);
    };

    const handleOrder = (e) => {
        if (selectedAddress && paymentMethod) {
            const order = {
                items,
                totalAmount,
                totalItems,
                user: user.id,
                paymentMethod,
                selectedAddress,
                status: 'pending', // other status can be delivered, received.
            };
            dispatch(createOrderAsync(order));
            // need to redirect from here to a new page of order success.
        } else {

            alert('Enter Address and Payment method');
        }
    };

    const addresses = [
        {
            name: "John cock",
            street: "12th corner",
            city: "Delhi",
            pincode: 12232,
            state: "Delhi",
            phone: 23456563425
        },
        {
            name: "Tom cock",
            street: "11th corner",
            city: "Delhi",
            pincode: 19832,
            state: "Delhi",
            phone: 26565563425
        },
    ]
    return (
        <>
            {!items.length && <Navigate to="/" replace={true}></Navigate>}
            {currentOrder && (
                <Navigate
                    to={`/orderSuccess/${currentOrder.id}`}
                    replace={true}
                ></Navigate>
            )}
            {/* {currentOrder && currentOrder.paymentMethod === 'card' && (
                        <Navigate to={`/stripe-checkout/`} replace={true}></Navigate>
                    )} */}

            {status === 'loading' ? (
                <Grid
                    height="80"
                    width="80"
                    color="rgb(79, 70, 229) "
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            ) : <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-10">
                    <div className="lg:col-span-7">
                        {/* This form is for address */}
                        <form
                            className="bg-white px-5 py-12 mt-12"
                            noValidate
                            onSubmit={handleSubmit((data) => {
                                console.log(data);
                                dispatch(
                                    updateUserAsync({
                                        ...user,
                                        addresses: [...user.addresses, data],
                                    })
                                );
                                reset();
                            })}
                        >
                            <div className="space-y-12">
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                                        Personal Information
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Use a permanent address where you can receive mail.
                                    </p>

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-4">
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Full name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('name', {
                                                        required: 'name is required',
                                                    })}
                                                    id="name"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500">{errors.name.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Email address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    {...register('email', {
                                                        required: 'email is required',
                                                    })}
                                                    type="email"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Phone
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="phone"
                                                    {...register('phone', {
                                                        required: 'phone is required',
                                                    })}
                                                    type="tel"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500">{errors.phone.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label
                                                htmlFor="street-address"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Street address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('street', {
                                                        required: 'street is required',
                                                    })}
                                                    id="street"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.street && (
                                                    <p className="text-red-500">
                                                        {errors.street.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 sm:col-start-1">
                                            <label
                                                htmlFor="city"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                City
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('city', {
                                                        required: 'city is required',
                                                    })}
                                                    id="city"
                                                    autoComplete="address-level2"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500">{errors.city.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="state"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                State / Province
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('state', {
                                                        required: 'state is required',
                                                    })}
                                                    id="state"
                                                    autoComplete="address-level1"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.state && (
                                                    <p className="text-red-500">{errors.state.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="pinCode"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                ZIP / Postal code
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('pinCode', {
                                                        required: 'pinCode is required',
                                                    })}
                                                    id="pinCode"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                {errors.pinCode && (
                                                    <p className="text-red-500">
                                                        {errors.pinCode.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                    <button
                                        // onClick={e=>reset()}
                                        type="button"
                                        className="text-sm font-semibold leading-6 text-gray-900"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Addresses
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Choose from Existing addresses
                            </p>
                            <ul>
                                {user && user.addresses.map((address, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                                    >
                                        <div className="flex gap-x-4">
                                            <input
                                                onChange={handleAddress}
                                                name="address"
                                                type="radio"
                                                value={index}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {address.name}
                                                </p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                    {address.street}
                                                </p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                    {address.pinCode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">
                                                Phone: {address.phone}
                                            </p>
                                            <p className="text-sm leading-6 text-gray-500">
                                                {address.city}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 space-y-10">
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                        Payment Methods
                                    </legend>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Choose One
                                    </p>
                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="cash"
                                                name="payments"
                                                onChange={handlePayment}
                                                value="cash"
                                                type="radio"
                                                checked={paymentMethod === 'cash'}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label
                                                htmlFor="cash"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Cash
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="card"
                                                onChange={handlePayment}
                                                name="payments"
                                                checked={paymentMethod === 'card'}
                                                value="card"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label
                                                htmlFor="card"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Card Payment
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                                Cart
                            </h1>
                            <div className="flow-root">
                                {status === 'loading' ? (
                                    <Grid
                                        height="80"
                                        width="80"
                                        color="rgb(79, 70, 229) "
                                        ariaLabel="grid-loading"
                                        radius="12.5"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                    />
                                ) : null}
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex py-6">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <a href={item.id}>{item.title}</a>
                                                        </h3>
                                                        <p className="ml-4">${item.discountPercentage}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.brand}
                                                    </p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <div className="text-gray-500">
                                                        <label
                                                            htmlFor="quantity"
                                                            className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                                        >
                                                            Qty
                                                        </label>
                                                        <select
                                                            onChange={(e) => handleQuantity(e, item)}
                                                            value={item.quantity}
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex">
                                                        <Modal
                                                            title={`Delete ${item.title}`}
                                                            message="Are you sure you want to delete this Cart item ?"
                                                            dangerOption="Delete"
                                                            cancelOption="Cancel"
                                                            dangerAction={(e) => handleRemove()}
                                                            cancelAction={() => setOpen(null)}
                                                            showModal={deleteItem.current===item.id && open}
                                                        ></Modal>
                                                        <button
                                                            onClick={e => { handleModal(item.id) }}
                                                            type="button"
                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>$ {totalAmount}</p>
                            </div>
                            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                                <p>Total Items in Cart</p>
                                <p>{totalItems} items</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="mt-6">
                                <div
                                    onClick={handleOrder}
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Pay & Order
                                </div>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or
                                    <Link to="/">
                                        <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Continue Shopping
                                            <span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}