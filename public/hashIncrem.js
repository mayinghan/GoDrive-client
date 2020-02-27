/**
 * A script for web-worker to hash a file
 * This hashing strategy should be used when hashing a large file
 */
self.importScripts('spark-md5.min.js');

// generate file hash
self.onmessage = e => {
	const { fileChunkList } = e.data;
	const spark = new self.SparkMD5.ArrayBuffer();
	let percentage = 0;
	let count = 0;
	const loadNext = index => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(fileChunkList[index].file);
		reader.onload = e => {
			count++;
			spark.append(e.target.result);
			if (count === fileChunkList.length) {
				// finish hashing
				self.postMessage({
					percentage: 100,
					hash: spark.end()
				});
				self.close();
			} else {
				percentage += 100 / fileChunkList.length;
				self.postMessage({
					percentage
				});

				// recursing to calculate the next chunk
				loadNext(count);
			}
		};
	};
	loadNext(0);
};
