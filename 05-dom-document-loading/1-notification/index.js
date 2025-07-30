export default class NotificationMessage {
	
	static isMsgShown = false;
	
	constructor(msg = '', {duration = 1000, type = 'success'} = {}) {
		this.msg = msg;
		this.duration = duration;
		this.type = this.checkMsgType(type);
		this.element = this.createMsg();
		
	}
	
	createMsg() {
		
		const div = document.createElement('tpl');
			
		div.innerHTML = this.msgTemplate();
		return div.firstElementChild;
		
	}
	
	msgTemplate() {
		return `
			<div class="notification ${this.type}" style="--value:20s">
				<div class="timer"></div>
				<div class="inner-wrapper">
				  <div class="notification-header">${this.type}</div>
				  <div class="notification-body">
					${this.msg}
				  </div>
				</div>
			  </div>		
		`;		
	}
	
	remove() {
		this.element.remove();
		NotificationMessage.isMsgShown = false;
	}
	
	destroy() {
		this.element.remove();
		NotificationMessage.isMsgShown = false;
	}
	
	checkMsgType(type) {
		let types = ['success','error'];
		if (types.includes(type)) {
			return type;
		} else {
			return types[0];
		}
	}
	
	show(node = document.body) {
		let parentNode;

		if (NotificationMessage.isMsgShown) return;
		
		if (typeof (node)=== 'string') {
			parentNode = document.querySelector(node);

		} else {
			parentNode = node;		
		}
			
		parentNode.append(this.element);

		NotificationMessage.isMsgShown = true;
		setTimeout(() => {
			this.remove();
		}, this.duration);
	}
}
