"""Initial database schema migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-21 22:35:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('badge_number', sa.String(), nullable=True),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False, server_default='POLICE_OFFICER'),
        sa.Column('department', sa.String(), nullable=True, server_default='Cyber Crime Branch'),
        sa.Column('state', sa.String(), nullable=True, server_default='Delhi'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_badge_number'), 'users', ['badge_number'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. Refresh Tokens table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token_hash', sa.String(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_refresh_tokens_id'), 'refresh_tokens', ['id'], unique=False)
    op.create_index(op.f('ix_refresh_tokens_token_hash'), 'refresh_tokens', ['token_hash'], unique=True)

    # 3. Fraud Reports table
    op.create_table(
        'fraud_reports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ack_number', sa.String(), nullable=False),
        sa.Column('victim_name', sa.String(), nullable=False),
        sa.Column('victim_phone', sa.String(), nullable=False),
        sa.Column('victim_email', sa.String(), nullable=True),
        sa.Column('victim_state', sa.String(), nullable=False),
        sa.Column('victim_district', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('amount_lost', sa.Float(), nullable=False),
        sa.Column('utr_number', sa.String(), nullable=True),
        sa.Column('target_upi_id', sa.String(), nullable=True),
        sa.Column('target_ifsc', sa.String(), nullable=True),
        sa.Column('target_account_no', sa.String(), nullable=True),
        sa.Column('scammer_phone', sa.String(), nullable=True),
        sa.Column('scammer_url_app', sa.String(), nullable=True),
        sa.Column('scammer_ip_address', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('location_address', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='NEW'),
        sa.Column('risk_score', sa.Integer(), nullable=True, server_default='75'),
        sa.Column('is_frozen', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fraud_reports_ack_number'), 'fraud_reports', ['ack_number'], unique=True)
    op.create_index(op.f('ix_fraud_reports_id'), 'fraud_reports', ['id'], unique=False)

    # 4. Evidence Files table
    op.create_table(
        'evidence_files',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.Integer(), nullable=False),
        sa.Column('file_name', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('file_type', sa.String(), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('sha256_hash', sa.String(), nullable=False),
        sa.Column('hash_verified', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('uploaded_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['report_id'], ['fraud_reports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evidence_files_id'), 'evidence_files', ['id'], unique=False)
    op.create_index(op.f('ix_evidence_files_sha256_hash'), 'evidence_files', ['sha256_hash'], unique=False)

    # 5. Fast Freeze Actions table
    op.create_table(
        'fast_freeze_actions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('report_id', sa.Integer(), nullable=False),
        sa.Column('action_reference', sa.String(), nullable=False),
        sa.Column('target_identifier', sa.String(), nullable=False),
        sa.Column('beneficiary_bank', sa.String(), nullable=False),
        sa.Column('amount_held', sa.Float(), nullable=False),
        sa.Column('freeze_status', sa.String(), nullable=False, server_default='REQUESTED'),
        sa.Column('freeze_timestamp', sa.DateTime(), nullable=True),
        sa.Column('police_badge', sa.String(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['report_id'], ['fraud_reports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fast_freeze_actions_action_reference'), 'fast_freeze_actions', ['action_reference'], unique=True)
    op.create_index(op.f('ix_fast_freeze_actions_id'), 'fast_freeze_actions', ['id'], unique=False)

def downgrade() -> None:
    op.drop_table('fast_freeze_actions')
    op.drop_table('evidence_files')
    op.drop_table('fraud_reports')
    op.drop_table('refresh_tokens')
    op.drop_table('users')
