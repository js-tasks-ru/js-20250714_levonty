export default class NotificationMessage {
	
	static activeNotification = null;
	
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
			<div class="notification ${this.type}" style="--value:${this.duration/1000}s">
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
	}
	
	destroy() {
		this.remove();
		clearTimeout(this.timerId);
		if (NotificationMessage.activeNotification === this) {
		  NotificationMessage.activeNotification = null;
		}
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
		
		if (NotificationMessage.activeNotification) {
		  NotificationMessage.activeNotification.destroy();
		}

		node.append(this.element);

		NotificationMessage.activeNotification = this;
		
		this.timerId = setTimeout(() => {
			this.remove();
		}, this.duration);
	}
}
