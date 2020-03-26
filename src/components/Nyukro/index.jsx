import PropTypes from 'prop-types';

const Nyukro = ({ launchuxes }) => (
  <>
    <div>Benyo dan Nyukro</div>
    <ul>
      {launchuxes.map((launch) => (
        <li key={launch.id}>{launch.site}</li>
      ))}
    </ul>
  </>
);

Nyukro.propTypes = {
  launchuxes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Nyukro;
