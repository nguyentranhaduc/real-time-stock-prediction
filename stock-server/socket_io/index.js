import yahooFinance from 'yahoo-finance2';
import { Server } from 'socket.io';

const io = new Server({
	cors: {
		origin: 'http://localhost:3000',
	},
});

const getQuote = async (quote) => {
	try {
		const result = await yahooFinance.quote(quote);
		return result;
	} catch (err) {
		return err;
	}
};

const getQuoteDetail = async (quote) => {
	try {
		const result = await yahooFinance.quote(quote);
		return result;
	} catch (err) {
		return err;
	}
};

io.on('connection', (socket) => {
	console.log('connection');

	socket.on('getQuote', (quote) => {
		getQuote(quote).then((res) => {
			io.emit('quoteResult', res);
		});
	});

	socket.on('getQuoteDetail', (quote) => {
		getQuoteDetail(quote).then((res) => {
			io.emit('quoteDetailResult', res);
		});
	});

	socket.on('disconnect', () => {
		console.log('disconnect');
	});
});

io.listen(8800);
