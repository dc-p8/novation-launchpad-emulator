

import { Component, ChangeDetectorRef } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { Key } from 'protractor';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	midi:WebMidi.MIDIAccess = null;
	available_devices:Map<String, any> = new Map();
	buttons = [
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
		0, 1, 2, 3, 4, 5, 6, 7, 8,
	]
	constructor(private _electronService: ElectronService,
		private changeDetectorRef:ChangeDetectorRef) {

	}

	array(): any[] {
		return Array(9*9);
	  }

	select(device:WebMidi.MIDIInput | WebMidi.MIDIOutput){
		console.log(device);
	}

	updateDevices(){
		if(this.midi)
		{
			let inputs = Array.from(this.midi.inputs.values());
			let outputs = Array.from(this.midi.outputs.values());
			this.available_devices.clear();
			var devices = inputs.forEach((input) => {
				let output = outputs.find((output) => {
					return output.name == input.name;
				});
				if(output != null)
				{
					this.available_devices.set(input.name,  {
						input:input,
						output:output
					})
				}
			});
			this.changeDetectorRef.detectChanges();
			console.log(this.available_devices);
		}
	}

	ngOnInit() {
		navigator.requestMIDIAccess().then((midi) => {
			this.midi = midi;
			this.updateDevices();
			this.midi.onstatechange = () => {
				this.updateDevices();
			}
		})
	}
	ngAfterViewInit(){
		
	}
	title = 'launchmad-emlator';
	devicename = '';
	
	onSubmit() {
		this._electronService.ipcRenderer.send('enable-device', this.devicename);
	}
	
}
