/**
 * A script for web-work to hash a file as a whole
 * This hashing method should only be used when hashing a small file less than 10 MB
 */
self.importScripts('spark-md5.min.js');

self.onmessage = async e => {
	const { file } = e.data;
	const spark = new self.SparkMD5.ArrayBuffer();
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onload = e => {
		spark.append(e.target.result);
		const hash = spark.end();
		self.postMessage({
			percentage: 100,
			hash: hash
		});
	};
};
