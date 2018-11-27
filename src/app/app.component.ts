

import { Component, ChangeDetectorRef, Input, ViewChildren, QueryList } from '@angular/core';

import { ElectronService } from 'ngx-electron';

class Device{
	name:string;
	input:WebMidi.MIDIInput;
	output:WebMidi.MIDIOutput;
}
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	state_buttons = []
	@ViewChildren('.button') bts:QueryList<any>;
	
	title = 'launchmad-emlator';
	devicename = 'Novation Launchpad S Emulated';
	output:WebMidi.MIDIOutput = null;
	input:WebMidi.MIDIInput = null;
	connected:boolean = false;
	//midi:WebMidi.MIDIAccess = null;
	//selectedDevice:Device = null;
	//available_devices:Array<Device> = [];
	//devices:WeakMap<String, WebMidi.MIDIInput | WebMidi.MIDIOutput> = new WeakMap();
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
	  /*
	select(device:Device){
		if(this.selectedDevice != null)
		{
			let {input, output} = this.selectedDevice;
			if(input.connection == "open"){
				input.close()
			}
			if(output.connection == "open")
			{
				//output.clear();
				output.close();
			}
			
			
			input.open();
			output.open();
			
			input.onmidimessage = (data) => {
				output.send(data.data);
			}
			
		}
		this.selectedDevice = device;
		console.log(this.selectedDevice);
		
		let {input, output} = this.selectedDevice;
		input.open();
		output.open();
	}
	*/

	/*
	updateDevices(){
		
		console.log('update')
		let inputs = Array.from(this.midi.inputs.values());
		let outputs = Array.from(this.midi.outputs.values());
		this.input = inputs.find((elem) => {
			return elem.id == this.devicename;
		});
		this.output = outputs.find((elem) => {
			return elem.id == this.devicename;
		})
		if(this.input && this.output)
			this.connected = true;
		else
			this.connected = false;
		
		this.available_devices = [];
		var devices = inputs.forEach((input) => {
			let output = outputs.find((output) => {
				return output.name == input.name;
			});
			if(output != null)
			{
				this.available_devices.push(
					{
						name:input.name,
						input:input,
						output:output
					});
			}
		});
		this.changeDetectorRef.detectChanges();
		console.log(this.available_devices);
			
	}
	*/

	onClick(i){
		console.log(i);
    }
    
    datas = [
		0b001100,
		0b001101,
		0b001110,
		0b001111,

		0b011100,
		0b011101,
		0b011110,
		0b011111,

		0b101100,
		0b101101,
		0b101110,
		0b101111,

		0b111100,
		0b111101,
		0b111110,
		0b111111,
    ]

    index = 0;

	ngOnInit() {
		
		navigator.requestMIDIAccess().then((midi) => { 
			
			console.log([...midi.inputs.values()])
			console.log([...midi.outputs.values()])
            this.output = midi.outputs.get('9E9E6D73897F974817B69DC984B2EEA68B27E811E7D860E70E40844D84549B8F');
            this.input = midi.inputs.get('F43E9F0AABC485BB5506792F42091A661734FED9AC5ED9CCE97D0F902E4185B7');
            this.input.onmidimessage = (e) => {
                let data = e.data;
                console.log(e.data);
                if(data[2] == 0)
                    return;
                data[2] = this.datas[this.index];
                this.index += 1;
                if(this.index == 16)
                    this.index = 0;
                    
                
                this.output.send(e.data);
            }
            midi.onstatechange = (s) => {
                
			};
		})
		
		
		
		// navigator.requestMIDIAccess().then((midi) => { 
		// 	let updateDevices = () => {
		// 		console.log('update');
		// 		let inputs = Array.from(midi.inputs.values());
		// 		let outputs = Array.from(midi.outputs.values());
		// 		console.log(inputs);
		// 		console.log(outputs);
		// 		let input = inputs.find((elem) => {
		// 			return elem.name == this.devicename;
		// 		});
		// 		let output = outputs.find((elem) => {
		// 			return elem.name == this.devicename;
		// 		})
		// 		if(input && output)
		// 		{
		// 			this.connected = true;
		// 			this.changeDetectorRef.detectChanges();
		// 			console.log('ok');
		// 			this.input = input;
		// 			this.output = output;
					
		// 			this.input.onmidimessage = (e) => {
		// 				this.output.send(e.data);
		// 			}
					
		// 		}
					
		// 		else
		// 		{
		// 			console.log('nok')
		// 			this.connected = false;
		// 			this.input = null;
		// 			this.output = null;
		// 		}
		// 	}
		// 	updateDevices();
		// 	midi.onstatechange = (e) =>{
		// 		updateDevices();
		// 	}
		// })
		
	}

	
	
	onSubmit() {
		let input = this.input;
		let output = this.output;
		this.input = null;
		this.output = null;
		if(input)
			input.close();
		if(output)
		{
			output.close();
		}
			
		this._electronService.ipcRenderer.send('enable-device', this.devicename);
	}
}
