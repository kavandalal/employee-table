import React from 'react';

function Input({ type, label, name, onChange, value, id, required, pattern, title, checked, maxLength, ...rest }) {
	return (
		<>
			<div className='row'>
				<div className='col-md-5'>
					<label htmlFor=''>{label}</label>
				</div>
				<div className='col-md-7'>
					{type === 'text' && (
						<input
							type='text'
							name={name}
							value={value}
							onChange={onChange}
							id={id}
							maxLength={maxLength}
							required={required}
						/>
					)}

					{type === 'email' && (
						<input type='email' name={name} value={value} onChange={onChange} id={id} required={required} />
					)}
					{type === 'tel' && (
						<input
							type='tel'
							name={name}
							value={value}
							pattern={pattern}
							onChange={onChange}
							id={id}
							title={title}
							required={required}
						/>
					)}
					{type === 'file' && (
						<input type='file' name={name} value={value} accept='image/*' onChange={onChange} id={id} />
					)}
				</div>
			</div>
		</>
	);
}

export default Input;
