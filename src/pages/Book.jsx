import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Image from '../assets/map.png';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5', // Set the background color to cream
        height: '100vh', // Full height of the viewport
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full height of the viewport
        paddingLeft: '8rem',
    },
    image: {
        maxWidth: '110%',
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full height of the viewport
    },
    form: {
        width: '80%', // Adjust as needed
        maxWidth: '400px', // Max width for the form
        backgroundColor: '#ffffff', // Set the form background color to white
        padding: theme.spacing(4), // Add padding to the form
        border: `1px solid ${theme.palette.grey[300]}`, // Add a border to the form
        borderRadius: theme.spacing(1), // Add border radius to the form
    },
    formTitle: {
        marginBottom: theme.spacing(3), // Add margin-bottom to the title
    },
}));

const BookingPage = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        date: '',
        name: '',
    });
    const [pathNames, setPathNames] = useState(['Western Line', 'Central Line', 'Harbour Line', 'Trans-Harbour Line', 'Andheri-Goregaon Line', 'Vasai Road-Dombivli Line', 'Thane-Navi Mumbai Line', 'Nerul-Uran Line']); // Sample path names

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.post(
            //     'http://localhost:8083/api/timetable/filterTT',
            //     {
            //         filterDate: formData.date,
            //         filterPathName: formData.name
            //     }
            // );
            // const trains = response.data.map(record => record.trainId);
            // console.log(trains)
            window.location.href = `/train?date=${formData.date}&trainPathName=${formData.name}`;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                {/* Left Half - Image */}
                <Grid item xs={6} className={classes.imageContainer}>
                    <img src={Image} alt="Image of Train Map" className={classes.image} />
                </Grid>

                {/* Right Half - Form */}
                <Grid item xs={6} className={classes.formContainer}>
                    <form onSubmit={handleSubmit} className={classes.form}>
                        <Typography variant="h5" className={classes.formTitle}>
                            Find Train
                        </Typography>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <TextField
                                    label="Date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    select
                                    label="Path Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                >
                                    {pathNames.map((path, index) => (
                                        <MenuItem key={index} value={path}>
                                            {path}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default BookingPage;