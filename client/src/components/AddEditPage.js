import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Input from '../common/Input';
import service from '../common/Service';
import { useAlert } from 'react-alert';

function AddEditPage() {
	const alert = useAlert();
	const navigate = useNavigate();
	const location = useLocation();
	let { username: paramUserName } = useParams();
	const [dataHere, setDataHere] = useState({
		id: 0,
		username: '',
		email: '',
		phone: '',
		gender: 'M',
		status: 'Y',
	});
	const [imageData, setImageData] = useState({
		url: '',
		originalUrl: '',
		changed: false,
	});

	useEffect(() => {
		if (location.state.data === 'edit') {
			getData(paramUserName);
		}
	}, []);

	const getData = async (paramUserName) => {
		await axios
			.get(`api/get/${paramUserName}`)
			.then((res) => {
				if (res?.data?.success) {
					const dataH = res?.data?.data;
					setDataHere((prev) => ({
						...prev,
						id: dataH?._id,
						username: dataH?.username,
						email: dataH?.email,
						phone: dataH?.phone,
						status: dataH?.status === true ? 'Y' : 'N',
						gender: dataH?.gender,
					}));
					setImageData((prev) => ({
						...prev,
						changed: false,
						url: dataH?.avatar?.url,
						originalUrl: dataH?.avatar?.url,
					}));
				} else {
					alert.error(res?.data?.message);
				}
			})
			.catch((err) => {
				alert.error('Something Went Wrong');
				console.error(err);
			});
	};

	const handleBack = () => {
		navigate(-1);
	};
	const onChange = (e) => {
		const { name, value } = e.target;

		setDataHere((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const imageChange = async (e) => {
		if (e.target.files[0]) {
			const x = await service.getImageUrls(e.target.files[0]);
			setImageData((prev) => ({
				...prev,
				changed: true,
				url: x,
			}));
		}
	};

	const removeImage = () => {
		setImageData((prev) => ({
			changed: false,
			url: prev?.originalUrl,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (location.state.data === 'edit') {
			const payload = {
				id: dataHere?.id,
				username: dataHere?.username,
				email: dataHere?.email,
				phone: dataHere?.phone,
				status: dataHere?.status === 'Y' ? true : false,
				gender: dataHere?.gender,
				avatar: '',
			};
			if (imageData?.changed) {
				payload.avatar = imageData?.url;
			}
			axios
				.post('api/edit', payload)
				.then((res) => {
					if (res?.data?.success) {
						alert.success('User Updated Successfully');
						navigate(-1);
					} else {
						alert.error(res?.data?.message);
					}
				})
				.catch((err) => {
					alert.error('Something Went Wrong');
					console.error(err);
				});
		} else if (location.state.data === 'add') {
			const payload = {
				username: dataHere?.username,
				email: dataHere?.email,
				phone: dataHere?.phone,
				status: dataHere?.status === 'Y' ? true : false,
				gender: dataHere?.gender,
				avatar: imageData?.url,
			};

			axios
				.post('api/register', payload)
				.then((res) => {
					if (res?.data?.success) {
						alert.success('User Created Successfully');
						navigate(-1);
					} else {
						alert.error(res?.data?.message);
					}
				})
				.catch((err) => {
					alert.error('Something Went Wrong');
					console.error(err);
				});
		}
	};

	return (
		<div>
			<section className='main__header'>
				<div className='d-flex justify-content-start align-items-center mb-2'>
					<div className='cursor-pointer  plus__icon' onClick={handleBack}>
						<i class='fa fa-arrow-left' aria-hidden='true'></i>
					</div>
				</div>
			</section>
			<section className='main__div '>
				<div className='px-4 h-full'>
					<div className='row h-full'>
						<div className='col-md-5'>
							<div className='d-flex h-full flex-column justify-content-center'>
								<div>{imageData?.url && <img src={imageData?.url} alt='' width={'300'} />}</div>
								<div>
									{imageData?.changed && (
										<button type='button' onClick={removeImage}>
											Remove
										</button>
									)}
									<Input type='file' onChange={imageChange}></Input>
								</div>
							</div>
						</div>
						<div className='col-md-7'>
							<form action='' className='h-full' onSubmit={handleSubmit}>
								<div className='d-flex h-full flex-column justify-content-center p-4'>
									<Input
										type='text'
										label={'Username'}
										name='username'
										value={dataHere?.username}
										onChange={onChange}
										maxLength={50}
										required
									/>
									<Input
										type='email'
										label={'Email'}
										name='email'
										value={dataHere?.email}
										onChange={onChange}
										required
									/>
									<Input
										type='tel'
										label={'Phone No.'}
										name='phone'
										value={dataHere?.phone}
										onChange={onChange}
										pattern={'[0-9]{10}'}
										title='Enter 10 Digit Number'
										required
									/>
									<div className='row'>
										<div className='col-md-5'>
											<label htmlFor=''>Gender</label>
										</div>
										<div className='col-md-7'>
											<select name='gender' value={dataHere?.gender} onChange={onChange} required>
												<option value='M'>Male</option>
												<option value='F'>Female</option>
												<option value='O'>Other</option>
											</select>
										</div>
									</div>
									<div>
										<div className='row'>
											<div className='col-md-5'>Status</div>
											<div className='col-md-7'>
												<div className='d-flex '>
													<div>
														<label htmlFor=''>True</label>
														<input
															type='radio'
															name='status'
															value={'Y'}
															onChange={onChange}
															checked={dataHere.status === 'Y'}
														/>
													</div>
													<div className=''>
														<label htmlFor=''>False</label>
														<input
															type='radio'
															name='status'
															value={'N'}
															onChange={onChange}
															checked={dataHere.status === 'N'}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='save__btn plus__icon mx-auto mt-4'>
										<button type='save'>Save</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default AddEditPage;
