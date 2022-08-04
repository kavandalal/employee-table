class Service {
	getImageUrls(singleImage) {
		if (singleImage) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					resolve(e.target.result);
				};
				reader.readAsDataURL(singleImage);
			});
		}
	}
}
export default new Service();
