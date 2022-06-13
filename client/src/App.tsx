import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { Moon, Sun, PlusLg } from 'react-bootstrap-icons';
import { v4 as uuidv4 } from "uuid";
import {stat} from "fs";

export type AppState = {
	tickets?: Ticket[],
	search: string,
	mood: string,
	openForm: boolean,
	payload: Ticket,
	errors: string,
	page: number,
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		mood: 'light',
		openForm: false,
		payload: {
			id: '',
			title: '',
			userEmail: '',
			content: '',
			creationTime: 0,
			labels: [],
			hide: false,
		},
		errors: '',
		page: 0,
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.page),
			page: this.state.page + 1,
		});
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		const HandleClick = (ticket: Ticket) => {
			const newTickets = filteredTickets.map(element => {
				if(element.id === ticket.id) {
					element.hide = !element.hide
				}
				return element;
			});

			this.setState({
				tickets: newTickets,
			})
		}

		const { mood } = this.state;

		return (
		<div className={ mood }>
			<ul className='tickets'>
				{ filteredTickets.map((ticket) => (
				<li key={ ticket.id } className='ticket'>
					<div className='flex'>
						<h5 className='title'>{ ticket.title }</h5>
						<button onClick={ () => HandleClick(ticket) } className='hideTicket overlay'>
							{
								!ticket.hide ? 'hide' : 'restore'
							}
						</button>
					</div>
					{
						!ticket.hide ?
							<p className='content'>
								{ ticket.content }
							</p>
							: null
					}
					<footer>
						<div className='meta-data'>By { ticket.userEmail } | { new Date(ticket.creationTime).toLocaleString()}</div>
					</footer>
				</li>))}
			</ul>
		</div>
		);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	mood = () => {
		this.setState({
			mood: this.state.mood === 'light' ? 'dark' : 'light',
		})
	}

	newTicket = async () => {
		this.setState({
			openForm: !this.state.openForm,
			errors: '',
		})
	}

	emailValidation = () =>{
		const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if(!this.state.payload.userEmail || regex.test(this.state.payload.userEmail) === false){
			this.setState({
				errors: "Email is not valid.",
			});
			return false;
		}
		return true;
	}

	handleSubmit = async () => {
		const { payload, tickets } = this.state;

		if(payload.title === '' || payload.content === '') {
			this.setState({
				errors: 'All fields are required',
			})

			return;
		}

		if(!this.emailValidation()){
			return;
		}

		const id = uuidv4();

		payload.id = id;
		payload.creationTime = new Date().getTime();
		payload.hide = false;

		try {
			await api.clone(this.state.payload);

			const newTicket = [payload];
			if(tickets)
				newTicket.push(...tickets );

			this.setState({
				tickets: newTicket,
				payload: {
					id: '',
					title: '',
					userEmail: '',
					content: '',
					creationTime: 0,
					labels: [],
					hide: false,
				},
				openForm: false,
			});
		} catch (error) {
			console.log(error);
		}
	}

	handleChange = (key: string, value: string) => {
		const payload = this.state.payload;
		switch (key) {
			case 'title':
				payload.title = value;
				break;
			case 'content':
				payload.content = value;
				break;
			case 'userEmail':
				payload.userEmail = value;
				break;
			case 'labels':
				payload.labels = value.split(',').filter(item => item.length > 0);
				break;
		}

		this.setState({
			payload,
			errors: '',
		})
	}

	form = () => {
		const { mood, errors } = this.state;

		return (
			<div className={ mood }>
				<div className='form-card'>
					<div className="row">
						<label htmlFor="title">Title</label>
						<input type="text" placeholder="title" onDragEnter={ this.handleSubmit } onChange={event => this.handleChange('title', event.target.value)} />
					</div>

					<div className="row-label">
						<p>
							Separate with a comma (,) between the labels
						</p>
						<div>
							<label htmlFor="labels">Labels</label>
							<input type="text" placeholder="labels" onKeyPress={ this.handleSubmit } onChange={event => this.handleChange('labels', event.target.value)} />
						</div>
					</div>


					<div className="row">
						<label htmlFor="content">Content</label>
						<textarea placeholder="content" onChange={event => this.handleChange('content', event.target.value)} />
					</div>

					<div className="row">
						<label htmlFor="email">Email</label>
						<input type="email" placeholder="email" onKeyPress={ this.handleSubmit } onChange={event => this.handleChange('userEmail', event.target.value)} />
					</div>

					{ errors !== '' ?
						<div className='errors'>
							{ errors }
						</div>
						: null
					}

					<div className="submit">
						<button onClick={ this.handleSubmit }>
							Send
						</button>
					</div>
				</div>
			</div>
		)
	}

	moreTickets = async () => {
		const more = await api.getTickets(this.state.page);

		this.setState({
			tickets: this.state.tickets?.concat(more),
			page: more.length === 20 ? this.state.page + 1 : -1,
		});
	}

	render() {	
		const { tickets, mood, openForm, page } = this.state;

		return (
		<main data-testid="main" className={ mood === 'light' ? 'main-light' : 'main-dark' }>
			<div className={ mood }>
				<button data-testid="dark-mood" onClick={ this.mood } className='dark_mood--button'>
					{ mood === 'light' ? 'Dark' : 'Light'} Mood
				</button>
				<div>
					<h1>Tickets List</h1>
				</div>
				<header>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
				</header>
				{ tickets ?
					<div className='flex'>
						<div className='results'>Showing {tickets.length} results</div>
						<button onClick={ this.newTicket } className='add-ticket'>
							<PlusLg className='icon-button' />
							{ openForm ? 'Cancel' : 'Add Ticket' }
						</button>
					</div>
					:
					null
				}

				{ openForm ?
					this.form()
					: null
				}

				{ tickets ?
					this.renderTickets(tickets)
					: <h2 data-testid="not-ticket">Loading..</h2>
				}

				{ page !== -1 ?
						<button data-testid='more' onClick={ this.moreTickets } className='more-button'>
							More Tickets
						</button>
						: <div data-testid='no-more' className='results'>
							no more result
						</div>
				}
			</div>
		</main>)
	}
}

export default App;