import React  from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
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
				return element
			});

			this.setState({
				tickets: newTickets,
			})
		}

		return (<ul className='tickets'>
			{ filteredTickets.map((ticket) => (<li key={ ticket.id } className='ticket'>
				<div className='header'>
					<h5 className='title'>{ ticket.title }</h5>
					<button onClick={() => HandleClick(ticket)} className='hideTicket overlay'>
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

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
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
		</main>)
	}
}

export default App;