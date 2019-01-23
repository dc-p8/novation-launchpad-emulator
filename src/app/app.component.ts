import { Component, ChangeDetectorRef, Input, ViewChildren, QueryList } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { DomSanitizer } from '@angular/platform-browser';
import { resolve } from 'url';

class Device{
	name:string;
	input:WebMidi.MIDIInput;
	output:WebMidi.MIDIOutput;
}

class BT{
	color:string = 'transparent';
	intensity:string = '0';
}

const channel1 = 0xB0;
const note_on = 0x90;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	//launchpad:WebMidi.MIDIOutput = null;
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
	buttons_colors:Array<BT> = Array.from({ length: 9*9 }, () => new BT())

	index = 0;
	
	layout = 'grid'

	constructor(private _electronService: ElectronService,
		private cd:ChangeDetectorRef) {
	}
	  

	onClick(i){
		console.log(i);
    }
	
	velocityToColorIntensity(color:number):Array<string>{
		let redIntensity= color & 3;
		let greenIntensity= color >> 4;
		console.log('color', color)
		console.log('red intensity', redIntensity);
		console.log('green intensity', greenIntensity);

		let ret = ''
		if(redIntensity > 0 && !greenIntensity)
			ret = 'rgb(250, 0, 40)';
		else if(redIntensity > 0 && redIntensity > greenIntensity)
			ret = 'rgb(250, 170, 0)';
		else if(redIntensity > 0 && greenIntensity == redIntensity)
			ret = 'rgb(250, 215, 0)'
		else if(redIntensity > 0 && greenIntensity > redIntensity)
			ret = 'rgb(190, 255, 0)'
		else if(greenIntensity > 0 && !redIntensity)
			ret = 'rgb(0, 255, 40)'
		else
			ret = 'transparent'
		//let ret = `rgb(${redIntensity * 255/3}, ${greenIntensity * (255/3)}, 0)`;
		console.log(ret);
		return [ret, Math.max(redIntensity, greenIntensity).toString()];

	}

	noteToGrid(n:number):Array<number>{

		let x = 0;
		let y = 8;

		if(this.layout == 'musical')
		{
			let y_offset = n / 4;

			if(n < 100)
			{
				if(n >= 68)
				{
					x = 4;
					y_offset = y_offset - 17;
				}
				else
				{
					x = 0;
					y_offset = y_offset - 9;
				}
				y_offset -= 1;

				// invertion
				y = 7 - y_offset
				x += n % 4;
			}
			else{
				y = n - 100;
				x = 8;
			}
		}
		else if(this.layout == 'grid')
		{
			x = n % 16;
			y = n / 16 + 1;
		}

		return [Math.floor(x), Math.floor(y)];
		
	}

	clearBoard(){
		this.buttons_colors.forEach((bt) => {
			bt.color = 'transparent';
			bt.intensity = '0';
		});
	}
	
    processInput(e:Uint8Array){
		if(e[0] == note_on)
		{
			let [x, y] = this.noteToGrid(e[1]);
			console.log(x, y);
			let bt = this.buttons_colors[y * 9 + x];
			let [color, intensity] = this.velocityToColorIntensity(e[2]);
			bt.color = color;
			bt.intensity = intensity;
			this.cd.detectChanges();
		}
		if(e[0] == channel1 && e[1] == 0 && e[2] == 0)
		{
			this.clearBoard();
		}
		/*
		if(e.length != 3)
			console.log('anomalie length');
		if(e[0] != channel1)
			console.log('anomalie channel');
		if(e[0] == channel1){
			if(e[1] == 0)
			{
				// Changement de layout
				if(e[2] == 1)
					this.layout = 'grid';
				else if(e[2] == 2)
					this.layout = 'musical'
			}
		}
		*/
	}

	/*
	async Test(n){
		console.log('buttons', this.buttons_colors);
		console.log('n', n);
		let data = eval(n);
		let emulated_output = await navigator.requestMIDIAccess().then((midi) => {
			let outputs = Array.from(midi.outputs.values());
			return outputs.find((elem) => {
				return elem.name == this.devicename;
			});
		});
		let send = (data) => {
			emulated_output.send(data);
			this.launchpad.send(data);	
		}
		send([0x90, 0x50, 0b000011])
		send([0x90, 0x51, 0b010011])
		send([0x90, 0x52, 0b100011])
		send([0x90, 0x53, 0b110011])
		send([0x90, 0x54, 0b110001])
		send([0x90, 0x55, 0b110010])
		send([0x90, 0x56, 0b110000])

		send([0x90, 0x57, 0b000000])

		send([0x90, 0x60, 0b000010])
		send([0x90, 0x61, 0b010010])
		send([0x90, 0x62, 0b000000])
		send([0x90, 0x63, 0b100010])
		send([0x90, 0x64, 0b000000])
		send([0x90, 0x65, 0b000000])
		send([0x90, 0x66, 0b100000])

		send([0x90, 0x70, 0b000001])
		send([0x90, 0x71, 0b000000])
		send([0x90, 0x72, 0b000000])
		send([0x90, 0x73, 0b010001])
		send([0x90, 0x74, 0b000000])
		send([0x90, 0x75, 0b000000])
		send([0x90, 0x76, 0b010000])

		send([0x90, 0x78, 0b010001])
	}
	*/
	ngOnInit() {
		this._electronService.ipcRenderer.send('enable-device', this.devicename);
		this.cd.detectChanges();
		console.log('device', this.devicename);
		this._electronService.ipcRenderer.on('fake-input-message', (sender, data) => {
			console.log('received dada');
			console.log(data);
			this.processInput(data);
		});
		navigator.requestMIDIAccess().then((midi) => { 
			let updateDevices = () => {

				//TODO:Supprimer ça
				//this.launchpad = midi.outputs.get('C2523F6B29E13D52D5111FEE04C5543EA99B744695D72158F7AEA1BDFF6EEAEB');

				console.log('update');
				let inputs = Array.from(midi.inputs.values());
				let outputs = Array.from(midi.outputs.values());
				console.log(inputs);
				console.log(outputs);
				let input = inputs.find((elem) => {
					return elem.name == this.devicename;
				});
				let output = outputs.find((elem) => {
					return elem.name == this.devicename;
				})
				if(input && output)
				{
					this.connected = true;
					this.cd.detectChanges();
					console.log('ok');
					this.input = input;
					this.output = output;
					this.input.onmidimessage = (e) => {
						//this.output.send(e.data);
					}
					
				}
					
				else
				{
					console.log('nok')
					this.connected = false;
					this.input = null;
					this.output = null;
				}
			}
			updateDevices();
			midi.onstatechange = (e) =>{
				updateDevices();
			}
		})
		
	}

	
	/*
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
			
		
	}
	*/
}
