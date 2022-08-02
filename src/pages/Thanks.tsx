import React from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

export const Thanks = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Paper elevation={0}>
        <Typography variant="h3" gutterBottom>
          {t('thks')}
        </Typography>
        <Box sx={{ display: 'flex'}}>
          <Card sx={{ maxWidth: 345, mr: 2 }}>
            <Typography align="center" sx={{height: 140}} >
              <svg width="202" height="56" style={{marginTop: '40'}} viewBox="0 0 294 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M122.771 21.6745H115.891V12.9143H105.75V21.6745H100.751V29.2921H105.75V48.3361C105.702 55.5014 110.582 59.0484 117.938 58.7389C120.557 58.6437 122.414 58.12 123.437 57.7867L121.842 50.2405C121.342 50.3357 120.271 50.5738 119.319 50.5738C117.295 50.5738 115.891 49.812 115.891 47.003V29.2921H122.771V21.6745Z" fill="black"></path>
                <path d="M129.376 58.239H139.517V21.6745H129.376V58.239ZM134.471 16.9611C137.494 16.9611 139.97 14.652 139.97 11.8192C139.97 9.01026 137.494 6.70117 134.471 6.70117C131.471 6.70117 128.996 9.01026 128.996 11.8192C128.996 14.652 131.471 16.9611 134.471 16.9611Z" fill="black"></path>
                <path d="M147.641 71.9507H157.782V52.383H158.091C159.496 55.43 162.567 58.8341 168.47 58.8341C176.802 58.8341 183.301 52.2401 183.301 40.0044C183.301 27.4353 176.516 21.1984 168.494 21.1984C162.376 21.1984 159.448 24.8406 158.091 27.8162H157.639V21.6745H147.641V71.9507ZM157.568 39.9568C157.568 33.4342 160.329 29.2683 165.257 29.2683C170.279 29.2683 172.946 33.6246 172.946 39.9568C172.946 46.3365 170.232 50.7642 165.257 50.7642C160.377 50.7642 157.568 46.4793 157.568 39.9568Z" fill="black"></path>
                <path d="M209.51 21.6745H202.63V12.9143H192.49V21.6745H187.49V29.2921H192.49V48.3361C192.442 55.5014 197.322 59.0484 204.678 58.7389C207.296 58.6437 209.153 58.12 210.177 57.7867L208.582 50.2405C208.082 50.3357 207.011 50.5738 206.058 50.5738C204.035 50.5738 202.63 49.812 202.63 47.003V29.2921H209.51V21.6745Z" fill="black"></path>
                <path d="M229.197 58.8341C235.1 58.8341 238.171 55.43 239.576 52.383H240.004V58.239H250.002V21.6745H239.885V27.8162H239.576C238.219 24.8406 235.291 21.1984 229.173 21.1984C221.151 21.1984 214.366 27.4353 214.366 40.0044C214.366 52.2401 220.865 58.8341 229.197 58.8341ZM232.41 50.7642C227.435 50.7642 224.721 46.3365 224.721 39.9568C224.721 33.6246 227.388 29.2683 232.41 29.2683C237.338 29.2683 240.1 33.4342 240.1 39.9568C240.1 46.4793 237.291 50.7642 232.41 50.7642Z" fill="black"></path>
                <path d="M258.34 71.9507H268.481V52.383H268.79C270.195 55.43 273.266 58.8341 279.169 58.8341C287.501 58.8341 294 52.2401 294 40.0044C294 27.4353 287.216 21.1984 279.193 21.1984C273.075 21.1984 270.147 24.8406 268.79 27.8162H268.338V21.6745H258.34V71.9507ZM268.267 39.9568C268.267 33.4342 271.028 29.2683 275.956 29.2683C280.979 29.2683 283.645 33.6246 283.645 39.9568C283.645 46.3365 280.931 50.7642 275.956 50.7642C271.076 50.7642 268.267 46.4793 268.267 39.9568Z" fill="black"></path>
                <path d="M36.3979 0C30.1994 0 24.3628 1.54943 19.2542 4.2821H53.5415C48.4329 1.54943 42.5963 0 36.3979 0Z" fill="black"></path>
                <path d="M59.8522 8.56344H12.9435C11.3953 9.86933 9.95759 11.302 8.64635 12.8455H64.1494C62.8381 11.302 61.4004 9.86933 59.8522 8.56344Z" fill="black"></path>
                <path d="M67.2822 17.1283H5.51348C4.6575 18.4974 3.89002 19.9274 3.21906 21.4104H69.5766C68.9057 19.9274 68.1382 18.4974 67.2822 17.1283Z" fill="black"></path>
                <path d="M71.1957 25.6918H1.60004C1.1718 27.0853 0.824967 28.5146 0.5651 29.9739H72.2306C71.9707 28.5146 71.6239 27.0853 71.1957 25.6918Z" fill="black"></path>
                <path d="M72.7338 34.2567H0.0619353C0.0208355 34.9651 0 35.6791 0 36.3979C0 37.1165 0.0208297 37.8304 0.0619182 38.5387H72.7338C72.7749 37.8304 72.7957 37.1165 72.7957 36.3979C72.7957 35.6791 72.7749 34.9651 72.7338 34.2567Z" fill="black"></path>
                <path d="M72.2307 42.8215H0.565048C0.824902 44.2809 1.17172 45.7101 1.59995 47.1036H71.1957C71.624 45.7101 71.9708 44.2809 72.2307 42.8215Z" fill="black"></path>
                <path d="M69.5768 51.385H3.21892C3.88987 52.868 4.65733 54.298 5.51329 55.6671H67.2824C68.1384 54.298 68.9058 52.868 69.5768 51.385Z" fill="black"></path>
                <path d="M64.1496 59.9499H8.6461C9.95731 61.4934 11.395 62.9261 12.9431 64.232H59.8526C61.4007 62.9261 62.8384 61.4934 64.1496 59.9499Z" fill="black"></path>
                <path d="M53.542 68.5133H19.2537C24.3216 71.2244 30.1061 72.7709 36.2497 72.7954H36.546C42.6896 72.7709 48.4741 71.2244 53.542 68.5133Z" fill="black"></path>
              </svg>
            </Typography>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                tiptap
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The headless editor framework for web artisans.Tiptap gives you full control about every single aspect of your text editor experience. It’s customizable, comes with a ton of extensions
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://tiptap.dev/"
                underline="none"
                sx={{ml: 1}}>More</Link>
            </CardActions>
          </Card>
          <Card sx={{ maxWidth: 345, mr: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image="https://web3in2032.io/works/3.png"
              alt="my first nft"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                MyFirstNFT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                MyFirstNFT is a non-profit instructional project for Web3 newbies. Get a FREE NFT while learning about Web3, underlying values of NFT, and security principles.
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://myfirstnft.info/"
                underline="none"
                sx={{ml: 1}}>More</Link>
            </CardActions>
          </Card>
          <Card sx={{ maxWidth: 345 }}>
            <Typography variant="h3" align="center" sx={{color: 'white', height: 120, backgroundColor: '#558b2f', pt: 5}} >
              html2canvas
            </Typography>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                html2canvas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The script allows you to take "screenshots" of webpages or parts of it, directly on the users browser.
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://html2canvas.hertzen.com/"
                underline="none"
                sx={{ml: 1}}>More</Link>
            </CardActions>
          </Card>
        </Box>
      </Paper>
    </Container>
  );

}