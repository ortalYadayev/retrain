import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { Moon, Sun } from 'react-bootstrap-icons';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	mood: string,
}

const api = createApiClient();


export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		mood: 'light',
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
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
				{ filteredTickets.map((ticket) => (<li key={ ticket.id } className='ticket'>
					<div className='header'>
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

	Mood = () => {
		this.setState({
			mood: this.state.mood === 'light' ? 'dark' : 'light',
		})
	}

	render() {	
		const { tickets, mood } = this.state;

		return (
		<main className={ mood === 'light' ? 'main-light' : 'main-dark' }>
			<div className={ mood }>
				<div className='header'>
					<h1>Tickets List</h1>
					<button onClick={ this.Mood } className='dark_mood--button'>
						{ mood === 'light' ?
								<div>
									Switch To dark Mood
									<Moon className='icon-button' />
								</div>
								: <div>
									Switch To Light Mood
									<Sun className='icon-button' />
								</div>
						}
					</button>
				</div>
				<header>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
				</header>
				{ tickets ?
					<div className='results'>Showing {tickets.length} results</div>
					:
					null
				}
				{ tickets ?
					this.renderTickets(tickets)
					: <h2>Loading..</h2>
				}
			</div>
		</main>)
	}
}

export default App;